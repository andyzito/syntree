<!--
##file_doc

@title Head
@description Included on every page. Imports external libraries, all app scripts, and styles.

##end
-->
<head>
<script src="https://use.fontawesome.com/4d36999296.js"></script>
<script src="https://raw.githubusercontent.com/mikeric/rivets/v0.9.4/dist/rivets.bundled.min.js"></script>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/app/scripts.html'; ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/classes/render.php' ?>
<link rel="stylesheet" href="/style/css/main.css">
<link rel="icon" type="image/svg" href="/resources/tree.svg">
</head>
