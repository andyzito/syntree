<?php
include $_SERVER['DOCUMENT_ROOT'] . '/syntree/lib.php';

$renderid = $_POST['renderid'];

echo $R->$renderid();