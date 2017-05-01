<?php

function strip_html($html) {
	$r = "";
	foreach(preg_split("/((\r?\n)|(\r\n?))/", $html) as $line){
		if (!preg_match('/<!DOCTYPE|<head>|<meta|<html|<\/html|<title|<body>|<\/head>|<\/body>/', $line)) {
			$line = preg_replace('/<!--.*/', '<p class="own_requirement">Blue requirements are those I added on my own, while all other requirements were derived from conversations with \'clients\'. <strong>Bold requirements are those which have been implemented in the Syntree code.</strong>', $line);
			$line = preg_replace('/<(.*)>!/', '<\1 class="own_requirement">', $line);
			$r .= $line;
		}
	}
	return $r;
}

$html = shell_exec("sudo rst2html.py --no-generator --no-xml-declaration --stylesheet=\"\" " . "./docs/.source/requirements_list.rst");
$f = fopen("./docs/.source/requirements_list_source.html", "w");
fwrite($f, strip_html($html));
exec('cp ./docs/.source/requirements_list.rst ./docs/download/requirements_list.rst');