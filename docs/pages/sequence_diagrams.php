<!DOCTYPE html>

<html>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/head.php' ?>

    <body class="page_docs page_docs_sequence_diagrams">
    	<?php print($R->back_button()); ?>
    	<?php print($R->download_button("sequence_diagrams.zip")); ?>

    	<p class='note'>Made with PlantUML</p>

        <?php include $_SERVER['DOCUMENT_ROOT'] . '/docs/source/html/sequence_diagrams_source.html' ?>

    </body>
</html>