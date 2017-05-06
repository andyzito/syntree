<?php

$fcont = file_get_contents("./docs/source/base/class_diagram/class_diagram.json");
$data = json_decode($fcont);

$classes = [];
foreach ($data->docs as $k => $d) {
	$kind = $d->kind;
	if ($kind === 'class') {
		$temp = [];
		$temp['name'] = $d->name;
		$temp['methods'] = [];
		$temp['members'] = [];
		$classes[$d->longname] = $temp;
	}
}

foreach ($data->docs as $k => $d) {
	$kind = $d->kind;
	if ($kind === 'function' && array_key_exists($d->memberof, $classes)) {
		$classes[$d->memberof]['methods'][] = $d->name;
	} else if ($kind === 'member' && array_key_exists($d->memberof, $classes)) {
		$classes[$d->memberof]['members'][] = $d;
	}
}

function longname_strip($name) {
	return preg_replace('/.*\.|.*#/', '', $name);
}

function class_def($class) {
	$o = 'class ' . $class['name'] . ' {'  . "\n";
	foreach ($class['methods'] as $m) {
		$o .= '    ' . $m . "()\n";
	}
	foreach ($class['members'] as $m) {
		$type = "";
		if (property_exists($m, 'type')) {
			$type = " : " . $m->type->names[0];
		}
		$o .= '    ' . $m->name . $type . "\n";
	}
	$o .= '}' . "\n";
	return $o;
}

$o = "@startuml \n";
$o .= "title Syntree Class Diagram \n";

foreach ($classes as $class) {
	$o .= class_def($class);
}

$o .= "class Workspace << (S,#FF7700) Singleton >>" . "\n";
$o .= "class Lib << (S,#FF7700) Singleton >>" . "\n";
$o .= "class History << (S,#FF7700) Singleton >>" . "\n";
$o .= "class Tutorial << (S,#FF7700) Singleton >>" . "\n";

$o .= "SelectableElement <|-- Node" . "\n";
$o .= "SelectableElement <|-- Branch" . "\n";
$o .= "SelectableElement <|-- Arrow" . "\n";
$o .= "Element <|-- SelectableElement" . "\n";
$o .= "Tree o-- Node" . "\n";
$o .= "History *-- Action" . "\n";
$o .= "Workspace --> Page" . "\n";
$o .= "Page --> Tree" . "\n";
$o .= "Page --> Element" . "\n";
$o .= "Element *-- Graphic" . "\n";

$o .= "skinparam monochrome true" . "\n";
$o .= "skinparam shadowing false" . "\n";
$o .= "skinparam dpi 150" . "\n";

$o .= "@enduml";

$f = fopen("./docs/source/base/class_diagram/class_diagram.plantuml", "w");
fwrite($f, $o);