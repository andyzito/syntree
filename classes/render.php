<?php

if (!isset($_SESSION)){
	session_set_cookie_params(0);
	session_start();
}

if (!class_exists('Render')) {
	class Render {
		function navbar() {
			$o = '<a class="navbar_link navbar_link_left" href="index.php"><span>Home</span></a>';
			$o .= '<a class="navbar_link navbar_link_left" href="make.php"><span>Make a syntax tree!</span></a>';
			$o .= '<a class="navbar_link navbar_link_right modal_trigger" for-modal="create-account"><span>Make an account</span></a>';
			if (!is_array($_SESSION) || !isset($_SESSION['username'])) {
				$o .= '<a class="navbar_link navbar_link_right modal_trigger" for-modal="login"><span>Login</span></a>';
			}
			if (is_array($_SESSION) && isset($_SESSION['username'])) {
				$o .= '<a class="navbar_link navbar_link_right navbar_link__logout render_trigger"><span>Logout</span></a>';
			}

			return $o;
		}
	}
}

$R = new Render();