<!--
##file_doc_head

@@title Head
@@description Included on every page. Imports external libraries, all app scripts, and styles.

##end
-->
<head>
<script src="/external_libs/jquery-3.2.0.min.js"></script>
<script src="/external_libs/rgbcolor.js"></script>
<script src="/external_libs/StackBlur.js"></script>
<script src="/external_libs/canvg.js"></script>
<script src="/external_libs/snap.js"></script>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/app/scripts.html'; ?>
<link rel="stylesheet" href="/style/css/main.css">
</head>