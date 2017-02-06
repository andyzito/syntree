<?php
include $_SERVER['DOCUMENT_ROOT'] . '/syntree/lib.php';

$newtreeid = gen_id();
$newtreestring = $_POST['treestring'];
$userid = $_SESSION['id'];

$treesaved = $DB->save_tree($newtreeid,$userid,$newtreestring);

$oldusertrees = $DB->select('treeids','user',"id=$userid");
$userupdated = $DB->update('treeids',$oldusertrees[0] . $newtreeid . ";",'user',"id=$userid");

if ($treesaved && $userupdated) {
	echo "Saved";
} else {
	echo "Sorry, there was a problem";
}