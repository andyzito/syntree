<?php
include $_SERVER['DOCUMENT_ROOT'] . '/syntree/classes/db.php';
$uname = $_POST['username'];
$pass = $_POST['password'];

$result = $DB->create_user(42,$uname,$pass,'','','');

echo $result;