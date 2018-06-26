<!--
##file_doc

@title Dev Page
@description Page for development purposes. Same as app-page.php. Separated so that the settings for the app can be fiddled with safely.

##end
-->
<!DOCTYPE html>

<html>
    <?php include '../head.php' ?>
    <script>
    $(document).ready(function(){
        init = {
            export_tree_script: '<?php echo WEBROOT ?>/export-tree.php',
            tutorial_enabled: false,
        }
        Syntree.initialize(init);
    });
    </script>

    <body class="page_make">

        <!-- <a href="index.php">
            <div class="button button_back">
            << Back
            </div>
        </a> -->

        <?php include DOCROOT . '/app/workspace-div.php' ?>

    </body>
</html>
