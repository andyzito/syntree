<?php
include $_SERVER['DOCUMENT_ROOT'] . '/syntree/lib.php';

$newtreeid = gen_id();
$newtreestring = $_POST['treestring'];

if ($DB->save_tree($newtreeid,$newtreestring)) {
	echo "Saved";
} else {
	echo "Sorry, there was a problem";
}