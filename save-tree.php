<?php
include $_SERVER['DOCUMENT_ROOT'] . '/syntree/lib.php';

if (!isset($_SESSION['username'])) {
	echo "Please log in to save your work";
	exit();
}
$userid = $_SESSION['id'];

if (!isset($_POST['treeid'])) {
	$treeid = gen_id();	
} else {
	$treeid = $_POST['treeid'];
}

$treestring = $_POST['treestring'];

$treesaved = $DB->save_tree($treeid,$userid,$treestring);

$oldusertrees = $DB->select('treeids','user',"id=$userid");
$userupdated = $DB->update('treeids',$oldusertrees[0] . $treeid . ";",'user',"id=$userid");

if ($treesaved && $userupdated) {
	echo $treeid;
}