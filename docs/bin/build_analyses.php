<?php

function strip_html($html) {
    $r = "";
    foreach(preg_split("/((\r?\n)|(\r\n?))/", $html) as $line){
        if (!preg_match('/<!DOCTYPE|<head>|<meta|<html|<\/html|<title|<body>|<\/head>|<\/body>/', $line)) {
            $line = preg_replace('/<p>(This is a historical document)/', '<p class="historical_warning">\1', $line);
            $r .= $line;
        }
    }
    return $r;
}

$zip = new ZipArchive();
if ($zip->open("./docs/download/class_analyses.zip", ZipArchive::CREATE)!==TRUE) {
    exit("cannot open <$filename>\n");
}

$o = '';
$files = array();
$dir = new DirectoryIterator("./docs/source/base/class_analyses/");
foreach ($dir as $fileinfo) {
    $files[$fileinfo->getFilename()] = clone($fileinfo);
}
ksort($files);
foreach ($files as $k => $fileinfo) {
    if (!$fileinfo->isDot() && strpos($fileinfo->getFilename(), '.rst') !== FALSE) {
        $html = shell_exec("sudo rst2html.py --no-generator --no-xml-declaration --stylesheet=\"\" " . $fileinfo->getPathname());
        $o .= strip_html($html);
        $zip->addFile($fileinfo->getPathname(),$fileinfo->getFilename());
    }
}

$f = fopen("./docs/source/html/class_analyses_source.html", "w");
fwrite($f, $o);