<!--
##file_doc

@title App Page
@description The main page for the app itself.

##end
-->
<!DOCTYPE html>

<html>
    <?php include '../head.php' ?>
    <script>
    $(document).ready(function(){
        init = {
            upload_enabled: true,
            tutorial_enabled: true,
            export_tree_script: '<?php echo WEBROOT ?>/export-tree.php',
        }
        new Syntree.initialize(init);
    });
    </script>

    <body class="page_make">

        <?php include DOCROOT . '/app/workspace-div.php' ?>

    </body>
</html>
