<?php
include $_SERVER['DOCUMENT_ROOT'] . '/lib.php';

$renderid = $_POST['renderid'];

echo $R->$renderid();