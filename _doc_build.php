<?php

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
define("HEAD_FILE", "_doc");

function build_head($path) {
	$head = parse_head($path);
	$res = $head['title'] . "\n";
	$res .= str_repeat("=", 50);
	$res .= "\n";
	$res .= $head['description'] . "\n\n";
	$res .= $head['more_description'];
	return $res;
}

function parse_file($p) {
	$f = fopen($p, "r");
	$res = [];
	$chunk = "";
	$add_to_chunk = FALSE;
	if ($f) {
		while (($line = fgets($f)) !== FALSE) {
			if (strpos($line, "##file_doc") !== FALSE) {
				$add_to_chunk = TRUE;
			} else if (strpos($line, "##end") !== FALSE) {
				$res['head'] = parse_head($chunk);
				$chunk = "";
				$add_to_chunk = FALSE;
			}
			if ($add_to_chunk) {
				$chunk .= $line;
			}
		}
		fclose($f);
		return $res;
	}
}

function has_docs($p) {
	if (is_dir($p) && file_exists($p . "/" . HEAD_FILE)) {
		return TRUE;
	} else if (!is_dir($p) && strpos(file_get_contents($p), "##file_doc") !== FALSE) {
		return TRUE;
	}
	return FALSE;
}

function has_own_docs($p) {
	if (is_dir($p) && file_exists($p . "/" . HEAD_FILE)) {
		if (strpos(file_get_contents($p . "/" . HEAD_FILE), "@has_own_docs") !== FALSE) {
			return true;
		} else {
			return false;
		}
	} else if (!is_dir($p) && strpos(file_get_contents($p), '@@@') !== FALSE) {
		return true;
	}
	return FALSE;
}

function parse_head($p) {
	$res = [];
	if (file_exists($p)) {
		$f = fopen($p . "/" . HEAD_FILE, "r");
		if ($f) {
			while (($line = fgets($f)) !== FALSE) {
				if (strpos($line, "@") !== FALSE) {
					$name = substr(explode(' ', $line)[0], 1);
					$val = preg_replace("/@\w+\s/", '', $line);
					$res[$name] = trim($val);
				}
			}
			fclose($f);
		}
	} else {
		foreach(preg_split("/((\r?\n)|(\r\n?))/", $p) as $line){
			if (strpos($line, "@") !== FALSE) {
				$name = substr(explode(' ', $line)[0], 1);
				$val = preg_replace("/@\w+\s/", '', $line);
				$res[$name] = trim($val);
			}
		}
	}
	return $res;
}

function build_dir_summary($p) {
	$props = parse_head($p);

	$res = "";
	if (has_own_docs($p)) {
		$res .= "`" . $props['title'] . " <" . $p . "/README.rst" . ">`_\n";
	} else {
		$res .= $props['title'] . "\n";
	}
	$res .= str_repeat("-", 50);
	$res .= "\n";
	// $res .= "(directory)";
	$res .= "`" . $p . " <" . $p . ">`_\n\n";
	$res .= $props['description'];
	return $res;
}

function build_file_summary($p) {
	$props = parse_file($p)['head'];
	if (has_own_docs($p)) {
		$res .= "`" . $props['title'] . " <" . $p . "_readme.rst>`_\n";
	} else {
		$res .= $props['title'] . "\n";
	}
	$res .= str_repeat("-", 50);
	$res .= "\n";
	// $res .= "(file)";
	$res .= "`" . $p . " <" . $p . ">`_\n\n";
	$res .= $props['description'];
	return $res;
}

function build_readme($path) {
	// Make the README for this directory
	$f = fopen($path . "/README.rst", "w");
	// Title and description of this directory
	$head = build_head($path);
	fwrite($f, $head);

	// Iterate through all files/directories
	// We're going to build a summary for each one
	$s = "\n\n";
	$dir = new DirectoryIterator($path);
	foreach ($dir as $fileinfo) {
		$summary = "";
	    if (!$fileinfo->isDot()) {
	    	$fname = $fileinfo->getFilename();
	    	$p = $fileinfo->getPathname();
	    	// Only use if not hidden (filename starts with '.') and not a _doc_ file
	    	if (strpos($p, "_doc") === FALSE && strpos($fname, ".") !== 0) {
	    		if (!is_dir($p) && has_docs($p)) {
	    			$summary = build_file_summary($p);
	    		} else if (is_dir($p) && has_docs($p)) {
	    			$summary = build_dir_summary($p);
	    		}
	    		if (preg_match("/\S/", $summary)) { // Only use if the summary is not empty
	    			$s .= $summary;
	    			$s .= "\n\n";
	    			echo "Added summary for " . $p . "\n";
	    		}
	    	}
	    }
	}
	fwrite($f, $s);
	fclose($f);
	// Remove any empty README's (just in case)
	if (!has_own_docs($path) || !preg_match("/\S/", file_get_contents($path . "/README.rst"))) {
		unlink($path . "/README.rst");
	} else {
		echo "Built README for " . $path . "\n";
	}

	// And now recurse:
	$dir = new DirectoryIterator($path);
	foreach ($dir as $fileinfo) {
	    if (!$fileinfo->isDot()) {
	    	$fname = $fileinfo->getFilename();
	    	$p = $fileinfo->getPathname();
	    	if (is_dir($p) && strpos($p, "_doc") === FALSE && strpos($fname, '.') !== 0) {
				build_readme($fileinfo->getPathname());
	    	}
	    }
	}
}

build_readme("./");