<?php
include $_SERVER['DOCUMENT_ROOT'] . '/syntree/lib.php';

$uname = $_POST['username'];
$pass = $_POST['password'];

$user = $DB->get_user($uname);

if (is_array($user) && $user['password'] === $pass) {
	echo 'logged in';
} else {
	echo 'incorrect username or password';
}
