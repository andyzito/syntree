<!DOCTYPE html>

<html>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/head.php' ?>

    <body class="page_docs page_docs_use_cases">
    	<?php print($R->back_button()); ?>
    	<?php print($R->download_button("use_cases.zip")); ?>

    	<p class="note">These are a selected, updated, and organized subset of the original use cases. You can view all of the original, unaltered use cases <a href="https://drive.google.com/open?id=0ByxFokfIIBmXbzRSdTBIWThfeTg">here.</a></p>
        <?php include $_SERVER['DOCUMENT_ROOT'] . '/docs/.source/use_cases_source.html' ?>

    </body>
</html>