<?php

/**
##file_doc

@title Export Tree
@description This is a script which takes a string identifying the type of file to export, and a filename to use. It returns a link to the generated file.

##end
**/
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