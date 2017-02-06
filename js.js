$(document).ready(function() {
	$(document).on('click', '.navbar_link__logout', function() {
		console.log('clicked');
		$.post('post/logout.php');
	});

	// Specific modal button callbacks
	function create_account() {
		var username = $('.modal_option__new-username input').val();
		var password = $('.modal_option__new-password input').val();

		$.post("post/new-user.php", {username: username, password: password}, function(result) {
			alert(result);
		});
	}
	$(document).on('click', '.modal_button__create-account', function(){create_account()});
	$(document).on('click', '.modal_button__login', function() {
		var username = $('.modal_option__username input').val();
		var password = $('.modal_option__password input').val();

		$.post("post/login.php", {username: username, password: password}, function(result) {
			alert(result);
		});
		modal_close($('.modal_body.modal_login').attr('with-overlay'));
	});

	$(document).on('click', '.render_trigger', function(){
		var renderables = $('[render-id]');
		for (i=0; i<renderables.length; i++) {
			var renderable = renderables[i];
			$.post("post/rerender.php", {renderid: $(renderable).attr('render-id')}, function(result) {
				$(renderable).html(result);
			});
		}
	});
});