<?php
// This is a script for the app
// It receives a filetype, a filename, and some data
// It creates a temporary file with this data and returns a download link
 
$type = $_POST['type'];
$fname = $_POST['fname'];

if ($type == 'bracket-file') {
    $file = fopen($_SERVER['DOCUMENT_ROOT'] . "/temp/$fname.txt", "w");
    fwrite($file, $_POST['brackets']);
    fclose($file);
    $link = "<a href='/temp/$fname.txt' download='' id='temp-file-download'></a>";
    echo $link;
} elseif ($type == 'tree-file') {
    $file = fopen($_SERVER['DOCUMENT_ROOT'] . "/temp/$fname.tree", "w");
    fwrite($file, $_POST['treestring']);
    fclose($file);
    $link = "<a href='/temp/$fname.tree' download='' id='temp-file-download'></a>";
    echo $link;
}