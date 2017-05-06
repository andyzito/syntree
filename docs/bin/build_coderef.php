<?php

function findToReg($find) {
	return "/(" . $find . ".*?)\s/";
}

$findreplace = array(
	array(
		"find" => array("Node"),
		"replace" => "[$1]{@link Syntree.Node} ",
		),
	array(
		"find" => array("Tree"),
		"replace" => "[$1]{@link Syntree.Tree} ",
		),
	array(
		"find" => array("Branch"),
		"replace" => "[$1]{@link Syntree.Branch} ",
		),
	array(
		"find" => array("Arrow"),
		"replace" => "[$1]{@link Syntree.Arrow} ",
		),
	array(
		"find" => array("Workspace"),
		"replace" => "[$1]{@link Syntree.Workspace} ",
		),
	array(
		"find" => array("Lib"),
		"replace" => "[$1]{@link Syntree.Lib} ",
		),
	array(
		"find" => array("Page"),
		"replace" => "[$1]{@link Syntree.Page} ",
		),
	array(
		"find" => array("Action"),
		"replace" => "[$1]{@link Syntree.Action} ",
		),
	array(
		"find" => array("\sElement"),
		"replace" => "[$1]{@link Syntree.Element} ",
		),
	array(
		"find" => array("SelectableElement"),
		"replace" => "[$1]{@link Syntree.SelectableElement} ",
		),
	array(
		"find" => array("Graphic"),
		"replace" => "[$1]{@link Syntree.Graphic} ",
		),
);

$f = fopen("./docs/source/base/home.mkd", 'r');
$o = "";

while (($line = fgets($f)) !== FALSE) {
	foreach ($findreplace as $fr) {
		foreach ($fr["find"] as $find) {
			// echo findToReg($find) . "\n";
			$line = preg_replace(findToReg($find), $fr["replace"], $line);
		}
	}
	$o .= $line;
}
fclose($f);

$f = fopen("./docs/source/html/home_processed.mkd", "w");
fwrite($f, $o);
fclose($f);

exec('jsdoc -r ./app --readme ./docs/source/html/home_processed.mkd -d ./docs/pages/coderef');