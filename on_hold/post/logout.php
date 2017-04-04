<?php
session_set_cookie_params(0);
session_start();
include $_SERVER['DOCUMENT_ROOT'] . '/lib.php';

$_SESSION = array();
session_unset();
session_destroy();