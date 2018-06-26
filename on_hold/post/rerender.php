<?php
include DOCROOT . '/lib.php';

$renderid = $_POST['renderid'];

echo $R->$renderid();