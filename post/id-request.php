<?php
include $_SERVER['DOCUMENT_ROOT'] . '/syntree/lib.php';

$n = intval($_POST['n']);
$result = gen_id($n);
echo $result;