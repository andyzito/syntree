<?php
$type = $_POST['type'];
$fname = $_POST['fname'];

if ($type == 'bracket-file') {
	$file = fopen("temp/$fname.txt", "w");
	fwrite($file, $_POST['brackets']);
	fclose($file);
	$link = "<a href='temp/$fname.txt' download='' id='temp-file-download'>HELLO!!!</a>";
	echo $link;
}