<?php
include $_SERVER['DOCUMENT_ROOT'] . '/lib.php';

if (!isset($_SESSION['id'])) {
    echo '<p>Please log in to see saved trees</p>';
    exit();
}

$trees = $DB->get_trees_by_user($_SESSION['id']);

$o = '';
foreach ($trees as $id => $treestring) {
    $o .= '<label>';
    $o .= "<input type=\"radio\" name=\"trees\" value=\"$id\">";
    $o .= "$treestring";
    $o .= '</label></br>';
}
echo $o;