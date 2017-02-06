<?php
include $_SERVER['DOCUMENT_ROOT'] . '/syntree/lib.php';

$uname = $_POST['username'];
$pass = $_POST['password'];
$id = gen_id(1);

$all_usernames = $DB->select('username','user');
if (in_array($uname,$all_usernames)) {
	$result = 'Sorry, that username is taken!';
} else {
	$DB->create_user($id,$uname,$pass,'','','');
	$result = 'Account created!';
}

echo $result;