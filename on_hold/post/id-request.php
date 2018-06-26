<?php
include DOCROOT . '/lib.php';

$n = intval($_POST['n']);
$result = gen_id($n);
echo $result;