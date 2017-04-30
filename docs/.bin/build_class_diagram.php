<?php

$fcont = file_get_contents("./docs/.source/class_diagram/class_diagram.json");
$data = json_decode($fcont);

// echo var_dump($fcont);
// echo var_dump(gettype($data));

$classes = [];
foreach ($data->docs as $k => $d) {
	$kind = $d->kind;
	if ($kind === 'class') {
		// echo $d->name . "\n";
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
		$classes[$d->memberof]['members'][] = $d->name;
	}
}

// echo var_dump($class);

function longname_strip($name) {
	return preg_replace('/.*\.|.*#/', '', $name);
}

function class_def($class) {
	$o = 'class ' . $class['name'] . ' {'  . "\n";
	foreach ($class['methods'] as $m) {
		$o .= '    ' . $m . "()\n";
	}
	foreach ($class['members'] as $m) {
		$o .= '    ' . $m . "\n";
	}
	$o .= '}' . "\n";
	return $o;
}

$o = "@startuml \n";

foreach ($classes as $class) {
	$o .= class_def($class);
}

$o .= "SelectableElement <|-- Node" . "\n";
$o .= "SelectableElement <|-- Branch" . "\n";
$o .= "SelectableElement <|-- Arrow" . "\n";
$o .= "Element <|-- SelectableElement" . "\n";
$o .= "Tree o-- Node" . "\n";
$o .= "History *-- Action" . "\n";
$o .= "Workspace --> Page" . "\n";
$o .= "@enduml";

$f = fopen("./docs/.source/class_diagram/class_diagram.plantuml", "w");
fwrite($f, $o);