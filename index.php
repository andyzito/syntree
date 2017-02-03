<!DOCTYPE html>

<html>
	<?php include 'includes/head.php' ?>
	<body>
		<div class="overlay" overlay-id="index"></div>
		
		<div id="main">
			
			<?php include 'includes/modal_create-account.php' ?>
			<?php include 'includes/modal_login.php' ?>

			<div class="container container_logo">
				<img src="resources/syntree-logo.png">
			</div>

			<nav class="navbar navbar_main">
				<a class="navbar_link navbar_link_left" href="index.php"><span>Home</span></a>
				<a class="navbar_link navbar_link_left" href="make.php"><span>Make a syntax tree!</span></a>
				<a class="navbar_link navbar_link_right modal_trigger" for-modal="create-account"><span>Make an account</span></a>
				<a class="navbar_link navbar_link_right modal_trigger" for-modal="login"><span>Login</span></a>
			</nav>

			<h1>Try it! Right here:</h1>
			<?php include 'app/workspace-div.php' ?>
			
		</div>
	</body>
</html>