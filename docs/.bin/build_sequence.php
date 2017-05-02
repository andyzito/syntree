<?php

function strip_html($html) {
	$r = "";
	foreach(preg_split("/((\r?\n)|(\r\n?))/", $html) as $line){
		if (!preg_match('/<!DOCTYPE|<head>|<meta|<html|<\/html|<title|<body>|<\/head>|<\/body>/', $line)) {
			$line = preg_replace('/<li>App:/', '<li class="actor_app">App:', $line);
			$line = preg_replace('/<li>User:/', '<li class="actor_user">User:', $line);
			$line = preg_replace('/<li>Syntree app \(App\)/', '<li class="actor_app">Syntree app (App)', $line);
			$line = preg_replace('/<li>User \(User\)/', '<li class="actor_user">User (User)', $line);

			$r .= $line;
		}
	}
	return $r;
}

$zip = new ZipArchive();
if ($zip->open("./docs/download/sequence_diagrams.zip", ZipArchive::CREATE)!==TRUE) {
    exit("cannot open <$filename>\n");
}

$o = '';
$files = array();
$dir = new DirectoryIterator("./docs/.source/sequence_diagrams/");
foreach ($dir as $fileinfo) {
	$files[$fileinfo->getFilename()] = clone($fileinfo);
}
ksort($files);
foreach ($files as $k => $fileinfo) {
	if (!$fileinfo->isDot() && $fileinfo->getFilename()) {
		if (strpos($fileinfo->getFilename(), '.png') !== FALSE) {
			$zip->addFile($fileinfo->getPathname(), 'images/' . $fileinfo->getFilename());
			$o .= '<img src="' . substr($fileinfo->getPathname(), 1) . '">';
			$o .= "\n";
		} else if (strpos($fileinfo->getFilename(), '.plantuml')) {
			$zip->addFile($fileinfo->getPathname(), 'source_notation/' . $fileinfo->getFilename());
		}
	}
}

$f = fopen("./docs/.source/sequence_diagrams_source.html", "w");
fwrite($f, $o);