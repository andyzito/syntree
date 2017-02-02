function modal_open(name) {
	var sel = ".modal_body.modal_" + name;
	$(sel).show();
	var over = $(".overlay.for-modal_"+name);
	over.show();
}

function modal_close() {
	$(".modal_body").hide();
	$(".overlay").hide();
}

$(document).ready(function() {
	$(".modal_body").hide();
	$(".overlay").hide();

	var all_triggers = $(".modal_trigger");
	for (i=0; i<all_triggers.length; i++) {
		var trig = all_triggers[i];
		$(trig).click(function() {
			var name = $(this).attr('for-modal');
			modal_open(name);
		});
	};

	$(document).on('click', '.overlay', function() {modal_close()});
	$(document).on('click', '.modal_button__cancel', function() {modal_close()});
});