<!-- Head included on every page
	Imports $DB, all app scripts, modal.js, and all stylesheets -->
<head>
<?php session_set_cookie_params(0) ?>
<?php session_start() ?>
<script type="text/javascript" src="http://canvg.github.io/canvg/rgbcolor.js"></script> 
<script type="text/javascript" src="http://canvg.github.io/canvg/StackBlur.js"></script>
<script type="text/javascript" src="http://canvg.github.io/canvg/canvg.js"></script> 
<?php include $_SERVER['DOCUMENT_ROOT'] . '/syntree/lib.php' ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/syntree/app/scripts.html'; ?>
<script src="modal.js"></script>
<script src="js.js"></script>
<link rel="stylesheet" href="css/css.css">
<link rel="stylesheet" href="app/css/css.css">
</head>

