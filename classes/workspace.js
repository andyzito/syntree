function Workspace() {
	this.svg = $("#workspace");
	this.ctrl = false;
	
	this.idRef = 100;
	this.genId = function() {
		this.idRef++;
		return this.idRef;
	}

	$(".modal_body").hide();
	$("#overlay").hide();

	this.page = new Page(this.genId(), this);
	var page = this.page;
	var W = this;
	
	$(document).on('click', '.node-label', function() {
		page.eventNodeClick(this);
	});
	
	$(document).on('click', '.delete_button', function() {
		page.eventDel();
	});
	
	$(document).on('click', '#background', function(e) {
		page.eventBGClick(e);
	});
	
	$(document).on('dblclick', '.node-label', function() {
		page.eventEnter();
	});
	
	$(document).on('keydown', function(e) {
		if (e.keyCode === 13) {
			page.eventEnter();
		} else if (e.keyCode === 37) {
			page.eventLeft();
		} else if (e.keyCode === 38) {
			page.eventUp();
		} else if (e.keyCode === 39) {
			page.eventRight();
		} else if (e.keyCode === 40) {
			page.eventDown();
		} else if (e.keyCode === 46) {
			page.eventDel();
		} else if (e.keyCode === 27) {
			page.eventEsc();
		} else if (e.keyCode === 17) {
			W.ctrl = true;
		}
	});
	
	$(document).on('keyup', function(e) {
		if (e.keyCode === 17) {
			W.ctrl = false;
		}
	});
	
	$(document).on('input', '.editor', function() {
		page.eventEditorTyping();
	});

	$(document).on('click', '.toolbar_button__export', function() {
		$(".modal_export.modal_body").show();
		$("#overlay").show();
	});

	$(document).on('click', '#overlay', function() {
		$(".modal_body").hide();
		$("#overlay").hide();
	});
	
	$(document).on('click', '.modal_button__cancel', function() {
		$(".modal_body").hide();
		$("#overlay").hide();
	});

	$(document).on('click', '.modal_option .modal_label', function(e) {
		var clicked = $(e.currentTarget).children('input');
		if ($(clicked).val() == 'bracket-file') {
			$('.modal_option__fname span').text('.txt');
		} else if ($(clicked).val() == 'png') {
			$('.modal_option__fname span').text('.png');
		}
	});
	
	$(document).on('click', '.modal_button__export', function() {
		// Get type
		var type = $('.modal_section__filetype input:checked').val();

		// Get fname
		var fname = $('.modal_option__fname input').val();
		
		// Get brackets if applicable
		if ($('.modal_option__bracket-file input:checked')) {
			var brackets = page.tree.toBracket();
		} else {
			var brackets = '';
		}

		// Post it
		$.post("receive-export.php", {fname: fname, type: type, brackets: brackets}, function(link) {
			$('body').append(link);
			$('#temp-file-download')[0].click();
			$('#temp-file-download').remove();
		});
	});

}
