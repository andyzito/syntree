<?php
include $_SERVER['DOCUMENT_ROOT'] . '/syntree/lib.php';

$uname = $_POST['username'];
$pass = $_POST['password'];
$id = gen_id(1);

$result = $DB->create_user($id,$uname,$pass,'','','');

echo $result;
