function Workspace(id) {
	W = this;
	this.id = id;
	this.ctrl = false;

	this._attachEventListeners = function() {
		// Store 'this' as local variable to avoid conflicts in callback scope
		var W = this;
		// Basic events, funneled to event functions below
		$(document).on('click', '.node-label', function() {W._eventNodeClick(this);});
		$(document).on('click', '.delete_button', function() {W._eventDel();});
		$(document).on('click', '#page-background', function(e) {W._eventBGClick(e);});
		$(document).on('dblclick', '.node-label', function() {W._eventEnter();});
		$(document).on('input', '.editor', function() {W._eventEditorTyping();});
		// Keyboard stuff
		$(document).on('keydown', function(e) {
			if ($(document.activeElement).parents('#workspace_container').length > 0) {
				if (e.keyCode === 13) { // Enter
					W._eventEnter();
				} else if (e.keyCode === 37) { // Left arrow key
					W._eventLeft();
				} else if (e.keyCode === 38) { // Up arrow key 
					W._eventUp();
				} else if (e.keyCode === 39) { // Right arrow key
					W._eventRight();
				} else if (e.keyCode === 40) { // Down arrow key
					W._eventDown();
				} else if (e.keyCode === 46) { // Delete key
					W._eventDel();
				} else if (e.keyCode === 27) { // Esc key
					W._eventEsc();
				} else if (e.keyCode === 17) { // CTRL
					W.ctrl = true; // to keep track of whether or not CTRL is pressed
				}
			}
		});
		// To keep track of whether or not CTRL is pressed
		$(document).on('keyup', function(e) {
			if (e.keyCode === 17) {
				W.ctrl = false;
			}
		});
		$(document).on('click', '.toolbar_button__save', function(){W._eventSave()});
		// Modal export stuff
		$(document).on('click', '.modal_section__filetype .modal_label', function(e) {W._eventFiletypeLabelClick(e)});
		$(document).on('click', '.modal_button__export', function() {W._eventExport()});
	}

	this._eventNodeClick = function(clickedNode) {
		var node = this.page.allNodes[$(clickedNode).attr('id').split('-')[1]];
		this.page.nodeSelect(node);
	}

	this._eventEnter = function() {
		this.page.nodeEditing('toggle');
	}
	
	this._eventLeft = function() {
		if (!this.ctrl) {
			this.page.navigateHorizontal('left');
		} else {
			this.page.navigateHorizontal('left',true);
		}
	}
	
	this._eventRight = function() {
		if (!this.ctrl) {
			this.page.navigateHorizontal('right');
		} else {
			this.page.navigateHorizontal('right',true);
		}
	}
	
	this._eventUp = function() {
		this.page.navigateUp();
	}
	
	this._eventDown = function() {
		if (!this.ctrl) {
			this.page.navigateDown();
		} else {
			this.page.navigateDown(true);
		}
	}
	
	this._eventDel = function() {
		this.page.nodeDelete();
	}
	
	this._eventEsc = function() {
		this.page.nodeEditing('cancel');
	}
	
	this._eventEditorTyping = function() {
		this.page.nodeEditing('update');
	}
	
	this._eventBGClick = function(e) {
		console.log('bgclick');
		var x = e.pageX - $("#workspace").offset().left;
		var y = e.pageY - $("#workspace").offset().top;
		var nearest = this.page.getNearestNode(x,y);
		var newNode = new Node(0,0);
		
		if (typeof nearest === 'object') {
			if (nearest.deltaY < -10) {
				if (nearest.deltaX > 0) {
					nearest.node.addChild(newNode,0);
				} else {
					nearest.node.addChild(newNode);
				}
			} else {
				var childIndex = nearest.node.getParent().getChildren().indexOf(nearest.node);
				if (nearest.deltaX > 0) {
					nearest.node.addChild(newNode,childIndex);
				} else {
					nearest.node.addChild(newNode,childIndex+1);
				}				
			}
		}
	}

	this._eventFiletypeLabelClick = function(e) {
		var clicked = $(e.currentTarget).children('input');
		if ($(clicked).val() == 'bracket-file') {
			$('.modal_option__fname span').text('.txt');
		} else if ($(clicked).val() == 'png') {
			$('.modal_option__fname span').text('.png');
		}
	}

	this._eventExport = function() {
		console.log('exporting');
		// Get type
		var type = $('.modal_section__filetype input:checked').val();

		// Get fname
		var fname = $('.modal_option__fname input').val();
		
		// Get brackets if applicable
		if ($('.modal_option__bracket-file input:checked')) {
			var brackets = this.page.tree.getBracketNotation();
		} else {
			var brackets = '';
		}

		// Post it
		$.post("app/receive-export.php", {fname: fname, type: type, brackets: brackets}, function(link) {
			$('body').append(link);
			$('#temp-file-download')[0].click();
			$('#temp-file-download').remove();
			console.log(link)
		});
	}

	this._eventSave = function() {
		var treestring = this.page.tree.getTreeString();
		var W = this;
		$.post('app/save-tree.php',{treestring:treestring,treeid:this.page.tree.getId()},function(result){
			if (result != '') {
				if (typeof W.page.tree.getId() !== 'number') {
					W.page.tree.setId(Number(result));
				}
				alert('Saved');
			} else {
				alert('Sorry, there was a problem');
			}
		});
	}

	this._attachEventListeners();

	// Make the page
	this.page = new Page();
	this.page.addTree();
}
