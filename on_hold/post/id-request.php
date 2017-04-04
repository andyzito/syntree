<?php
include $_SERVER['DOCUMENT_ROOT'] . '/lib.php';

$n = intval($_POST['n']);
$result = gen_id($n);
echo $result;