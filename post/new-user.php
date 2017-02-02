<?php
include '/var/www/html/div3/classes/db.php';
$uname = $_POST['username'];
$pass = $_POST['password'];

$result = $DB->create_user(42,$uname,$pass,'','','');

echo $result;