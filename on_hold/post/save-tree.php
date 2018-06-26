<?php
// This script is for the app
// It receives a tree string and saves it to the database
// It returns the tree id on success and false on failure

include DOCROOT . '/lib.php';

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
$oldids = explode(';', $oldusertrees[0]);
if (!in_array($treeid,$oldids)) {
    $userupdated = $DB->update('treeids', $oldusertrees[0] . $treeid . ";", 'user', "id=$userid");
} else {
    $userupdated = true;
}

if ($treesaved && $userupdated) {
    echo $treeid;
} else {
    echo false;
}