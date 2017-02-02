/**
* Opens a modal window
* @param {string} name This is the unique name of the modal
*/
function modal_open(name) {
	var modal = $(".modal_body.modal_" + name);
	modal.show();
	var overlay = $(".overlay.for-modal_" + name);
	overlay.show();
}

/**
* Closes ANY open modal
*/
function modal_close() {
	$(".modal_body").hide();
	$(".overlay").hide();
}

$(document).ready(function() {
	// Initialize ALL modals and overlays to hidden state
	$(".modal_body").hide();
	$(".overlay").hide();

	// Fetch any/all modal triggers and add event listeners
	var all_triggers = $(".modal_trigger");
	for (i=0; i<all_triggers.length; i++) {
		var trigger = all_triggers[i];
		$(trigger).click(function() {
			var name = $(this).attr('for-modal');
			modal_open(name);
		});
	};

	// Event listeners for closing modals
	$(document).on('click', '.overlay', function() {modal_close()});
	$(document).on('click', '.modal_button__cancel', function() {modal_close()});

	// Specific modal button callbacks
	$(document).on('click', '.modal_button__create-account', function() {
		var username = $('.modal_option__new-username input').val();
		var password = $('.modal_option__new-password input').val();

		$.post("post/new-user.php", {username: username, password: password}, function(result) {
			alert(result);
		});
	});
});
