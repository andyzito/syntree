<?php
session_set_cookie_params(0);
session_start();
include $_SERVER['DOCUMENT_ROOT'] . '/syntree/lib.php';

$uname = $_POST['username'];
$pass = $_POST['password'];

$user = $DB->get_user($uname);

if (is_array($user) && $user['password'] === $pass) {
	$_SESSION['id'] = $user['id'];
	$_SESSION['username'] = $user['username'];
	$_SESSION['firstname'] = $user['firstname'];
	$_SESSION['lastname'] = $user['lastname'];
	$_SESSION['email'] = $user['email'];
	echo 'Logged in';
} else {
	echo 'Incorrect username or password';
}
