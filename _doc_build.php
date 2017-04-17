<?php
// Credit to http://stackoverflow.com/questions/4202175/php-script-to-loop-through-all-of-the-files-in-a-directory
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

function parse_head($head, $path) {
	return preg_replace("/@@description/", file_get_contents($path . "/_doc_dir_descrip"), $head);
}

function parse_chunk($chunk) {
	$res = "";
	$headline = substr(preg_split("/((\r?\n)|(\r\n?))/", $chunk)[0], 2);
	$rest = preg_replace("/^.+\n/", '', $chunk);
	$hpieces = explode(",", $headline);
	$type = $hpieces[0];
	$name = $hpieces[1];
	if (count($hpieces) > 2) {
		$title = $hpieces[2];
	} else {
		$title = $name;
	}

	if ($type === 'file') {
		$res .= "### File: " . $title . "\n";
		$res .= "[" . $name . "](" . $name . ")\n\n";
		$res .= $rest;
	}
	return $res;
}

function parse_dir($path, $name) {
	if (file_exists($path . "/_doc_dir_descrip")) {
		$s = "### Directory:";
		$s .= "[" . $name . "](" . $name . "/README.md)\n";
		$s .= file_get_contents($path . "/_doc_dir_descrip");
		return $s;
	}
}

function parse_file($path) {
	$f = fopen($path, "r");
	$res = "";
	$chunk = "";
	$add_to_chunk = FALSE;
	if ($f) {
		while (($line = fgets($f)) !== FALSE) {
			if (strpos($line, "@@") !== FALSE) {
				$add_to_chunk = TRUE;
			} else if (strpos($line, "##end") !== FALSE) {
				$res .= parse_chunk($chunk);
				$res .= "\n";
				$chunk = "";
				$add_to_chunk = FALSE;
			}
			if ($add_to_chunk) {
				$chunk .= $line;
			}
		}
		fclose($f);
		return trim($res);
	}
}

function build_dir($path) {
	// Make the README for this directory
	echo "Building " . $path . "\n";

	$f = fopen($path . "/README.md", "w");
	// Default, non-generated text we want at the top
	$head = parse_head(file_get_contents($path . "/_doc_head"), $path);
	// Description of the directory
	$descrip = file_get_contents($path . "/_doc_dir_descrip");
	// Any config, e.g. whether or not to make separate doc files for each file
	$cfg = file_get_contents($path . "/_doc_cfg");
	// Any directories/files we want to ignore
	$ignore = file_get_contents($path . "/_doc_ignore");

	fwrite($f, $head);

	// Iterate through all files/directories
	$s = "\n\n";
	$dir = new DirectoryIterator($path);
	foreach ($dir as $fileinfo) {
	    if (!$fileinfo->isDot()) {
	    	$fname = $fileinfo->getFilename();
	    	$p = $fileinfo->getPathname();
	    	// Only use if not hidden (filename starts with '.') and not ignored
	    	if (strpos($p, "_doc_") === FALSE && strpos($fname, ".") !== 0) {
	    		if (!is_dir($p)) {
		    		$s .= parse_file($p);
	    		} else {
	    			$s .= parse_dir($p, $fname);
	    		}
	    		$s .= "\n\n";
	    	}
	    }
	}
	fwrite($f, $s);
	fclose($f);
	if (!preg_match("/\S/", file_get_contents($path . "/README.md"))) {
		unlink($path . "/README.md");
	}

	// And now recurse:
	$dir = new DirectoryIterator($path);
	foreach ($dir as $fileinfo) {
	    if (!$fileinfo->isDot()) {
	    	$fname = $fileinfo->getFilename();
	    	$p = $fileinfo->getPathname();
	    	if (is_dir($p) && strpos($p, "_doc_") === FALSE && strpos($fname, '.') !== 0) {
				build_dir($fileinfo->getPathname());
	    	}
	    }
	}
}

build_dir('./');