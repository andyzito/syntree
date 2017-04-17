<?php
// Credit to http://stackoverflow.com/questions/4202175/php-script-to-loop-through-all-of-the-files-in-a-directory
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

function parse_head($head) {
	return preg_replace("/@@description/", file_get_contents("_doc_dir_descrip"), $head);
}

function parse_chunk($chunk) {
	$res = "";
	$headline = substr(preg_split("/((\r?\n)|(\r\n?))/", $chunk)[0], 2);
	$rest = preg_replace("/^.+\n/", '', $chunk);
	$hpieces = explode(" ", $headline);
	$type = $hpieces[0];
	$name = $hpieces[1];
	if (count($hpieces) > 2) {
		$title = $hpieces[2];
	} else {
		$title = $name;
	}

	if ($type === 'file') {
		$res .= "## File: " . $title . "\n";
		$res .= "[" . $name . "](" . $name . ")\n";
		$res .= $rest;
	}
	return $res;
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
		return $res;
	}
}

function build_dir($path) {
	// Make the README for this directory
	echo "Building " . $path . "\n";

	$f = fopen($path . "/README.md", "w");
	// Default, non-generated text we want at the top
	$head = parse_head(file_get_contents($path . "/_doc_head"));
	// Description of the directory
	$descrip = file_get_contents($path . "/_doc_dir_descrip");
	// Any config, e.g. whether or not to make separate doc files for each file
	$cfg = file_get_contents($path . "/_doc_cfg");
	// Any directories/files we want to ignore
	$ignore = file_get_contents($path . "/_doc_ignore");

	echo "Writing head... \n";
	fwrite($f, $head);

	// Iterate through all the files
	$s = "\n\n";
	$dir = new DirectoryIterator($path);
	foreach ($dir as $fileinfo) {
	    if (!$fileinfo->isDot()) {
	    	$fname = $fileinfo->getFilename();
	    	$p = $fileinfo->getPathname();
	    	// Only use if it's not a directory, not hidden (filename starts with '.'), and not ignored
	    	if (!is_dir($p) && strpos($p, "_doc_") === FALSE && strpos($fname, ".") !== 0) {
		    	echo "Adding content from "  . $p . "\n";
	    		$s .= parse_file($p);
	    	}
	    }
	}
	fwrite($f, $s);

	fclose($f);

	// And now recurse:
	$dir = new DirectoryIterator($path);
	foreach ($dir as $fileinfo) {
	    if (!$fileinfo->isDot() && strpos($ignore, $path) !== FALSE) {
	    	$p = $fileinfo->getPathname();
	    	if (!is_dir($p) && strpos($p, "_doc_") === FALSE) {
				build_dir($fileinfo->getPathname());
	    	}
	    }
	}
}

build_dir('./');