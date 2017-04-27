<?php
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

function nav() {
	$o = '<div>';
	$o .= '<ul>';

}

function parse_rest_file($file) {
	$f = fopen($file, "r");
	$pieces = [];
	$prev_line = "";
	while (($line = fgets($f)) !== FALSE) {
		$piece = [];
		if (preg_match('/^\s*=+\s*$/', $line)) {
			$piece['type'] = 'header';
			$piece['content'] = trim($prev_line);
		} else if (preg_match('/^\s*-+\s*$/', $line)) {
			$piece['type'] = 'subheader';
			$piece['content'] = trim($prev_line);
		} else if (preg_match('/^\s*(\d|#)\..*\s*$/', $line)) {
			$piece['type'] = 'enum_list_item';
			$piece['content'] = preg_replace('/^\s*(\d|#)\.\s*/', '', trim($line));
		} else if (preg_match('/^\s*-.*\s*$/', $line)) {
			$piece['type'] = 'bullet_list_item';
			$piece['content'] = preg_replace('/^\s*-\s*/', '', trim($line));
		}

		if (array_key_exists('type', $piece)) {
			array_push($pieces, $piece);
		}
		$prev_line = $line;
	}

	$res = [];
	for ($i=0; $i < count($pieces); $i++) {
		$piece = $pieces[$i];
		$next = array('type' => '');
		$last = array('type' => '');
		if ($i+1 < count($pieces)) {
			$next = $pieces[$i+1];
		}
		if ($i > 0) {
			$last = $pieces[$i-1];
		}

		if (strpos($piece['type'], 'list_item') !== FALSE) {
			preg_match('/^(.*)_list_item/', $piece['type'], $listtype);
			if ($last['type'] !== $piece['type']) {
				$temp = [];
				$temp['type'] = $listtype[1] . "_list_begin";
				$temp['content'] = "";
				array_push($res, $temp);
				// array_splice($res, $i, 0, $temp);
			}
			array_push($res, $piece);
			if ($next['type'] !== $piece['type']) {
				$temp = [];
				$temp['type'] = $listtype[1] . "_list_end";
				$temp['content'] = "";
				array_push($res, $temp);
				// array_splice($res, $i+1, 0, $temp);
			}
		} else {
			array_push($res, $piece);
		}
	}

	return $res;
}

function rest_piece_to_html($piece, $class="") {
	$o = '';
	if ($piece['type'] === 'header') {
		$o .= '<h1 class="' . $class . '">' . $piece['content'] . '</h1>';
	} else if ($piece['type'] === 'subheader') {
		$o .= '<h3 class="' . $class . '">' . $piece['content'] . '</h1>';
	} else if ($piece['type'] === 'enum_list_begin') {
		$o .= '<ol class="' . $class . '">';
	} else if ($piece['type'] === 'bullet_list_begin') {
		$o .= '<ul class="' . $class . '">';
	} else if ($piece['type'] === 'enum_list_end') {
		$o .= '</ol>';
	} else if ($piece['type'] === 'bullet_list_end') {
		$o .= '</ul>';
	} else if ($piece['type'] === 'enum_list_item' || $piece['type'] === 'bullet_list_item') {
		$o .= '<li class="' . $class . '">' . $piece['content'] . '</li>';
	} else {
		echo var_dump($piece);
	}
	$o .= "\n";
	return $o;
}

function build_use_case_html($file) {
	$parsed = parse_rest_file($file);
	$o = '';
	foreach ($parsed as $piece) {
		$class = "";
		if (preg_match('/^App:.*/', $piece['content'])) {
			$class = "actor_app";
		} else if (preg_match('/^User:.*/', $piece['content'])) {
			$class = "actor_user";
		}
		$o .= rest_piece_to_html($piece, $class);
	}
	return $o;
}

function use_cases() {
	$f = fopen("./docs/se/use_cases/use_cases_source.html", "w");
	$o = '<div class="wrapper use-case-wrapper">';
	$dir = new DirectoryIterator("./docs/se/use_cases/");
	foreach ($dir as $fileinfo) {
		if (!$fileinfo->isDot()) {
			$o .= build_use_case_html($fileinfo->getPathname());
		}
	}
	$o .= '</div>';
	fwrite($f, $o);
}

function main() {
	use_cases();
}

main();