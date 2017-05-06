<!DOCTYPE html>

<html>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/head.php' ?>

    <body class="page_docs page_docs_class_analyses">
    	<?php print($R->back_button()); ?>
    	<?php print($R->download_button("class_analyses.zip")); ?>

        <?php include $_SERVER['DOCUMENT_ROOT'] . '/docs/source/html/class_analyses_source.html' ?>

    </body>
</html>