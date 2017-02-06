/**
* Opens a modal window
* @param {string} name This is the unique name of the modal
*/
function modal_open(name) {
	var modal = $(".modal_body.modal_" + name);
	modal.show();
	var overlay = $(".overlay[overlay-id=" + modal.attr('with-overlay') + "]");
	overlay.show();
}

/**
* Closes the corresponding modal
* @param {string} overlay The unique name of the overlay (can group multiple modals)
*/
function modal_close(overlay) {
	var modal = $(".modal_body[with-overlay=" + overlay + "]");
	modal.hide();
	var overlay = $(".overlay[overlay-id=" + overlay + "]");
	overlay.hide();
}

$(document).ready(function() {
	// Initialize ALL modals and overlays to hidden state
	$(".modal_body").hide();
	$(".overlay").hide();

	// Fetch any/all modal triggers and add event listeners
	$(document).on('click','.modal_trigger',function(e) {
		var name = $(e.currentTarget).attr('for-modal');
		modal_open(name);
	});

	// Event listeners for closing modals
	$(document).on('click', '.overlay', function(e) {
		var clicked = e.currentTarget;
		modal_close($(clicked).attr('overlay-id'));
	});
	$(document).on('click', '.modal_button__cancel', function(e) {
		var clicked = e.currentTarget;
		var modal = $(clicked).parents('.modal_body');
		modal_close(modal.attr('with-overlay'));
	});
});
