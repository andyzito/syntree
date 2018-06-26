<?php

if (!class_exists('Render')) {
    class Render {

    	function download_button($path, $title = "Download") {
    		if ($title !== "") {
    			$title = 'title="' . $title . '"';
    		} else {
    			$title = "";
    		}
    		$o = '<a ' . $title . ' class="download download_docs" href="'. WEBROOT . '/docs/download/' . $path . '" download><i class="fa fa-download" aria-hidden="true"></i></a>';
    		return $o;
    	}

        function back_button($path="/docs", $title = "Back") {
            if ($title !== "") {
                $title = 'title="' . $title . '"';
            } else {
                $title = "";
            }
            $o = '<a ' . $title . 'class="back" href="' . $path . '"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>';
            return $o;
        }
    }
}

if (!isset($R)) {
	$R = new Render();
}
