<?php

function strip_html($html) {
	$r = "";
	foreach(preg_split("/((\r?\n)|(\r\n?))/", $html) as $line){
		if (!preg_match('/<!DOCTYPE|<head>|<meta|<html|<\/html|<title|<body>|<\/head>|<\/body>/', $line)) {
			$r .= $line;
		}
	}
	return $r;
}

$o = '';
$dir = new DirectoryIterator("./docs/.source/use_cases/");
foreach ($dir as $fileinfo) {
	if (!$fileinfo->isDot() && strpos($fileinfo->getFilename(), '.rst') !== FALSE) {
		$html = shell_exec("sudo rst2html.py --no-generator --no-xml-declaration --stylesheet=\"\" " . $fileinfo->getPathname());
		$o .= strip_html($html);
	}
}

$f = fopen("./docs/.source/use_cases_source.html", "w");
fwrite($f, $o);
