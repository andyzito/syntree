<?php
$type = $_POST['type'];
$fname = $_POST['fname'];

if ($type == 'bracket-file') {
	$file = fopen($_SERVER['DOCUMENT_ROOT'] . "/syntree/temp/$fname.txt", "w");
	fwrite($file, $_POST['brackets']);
	fclose($file);
	$link = "<a href='/syntree/temp/$fname.txt' download='' id='temp-file-download'></a>";
	echo $link;
}