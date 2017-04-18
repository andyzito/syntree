<!--
##file_doc

@title Dev Page
@description Page for development purposes. Same as app-page.php. Separated so that the settings for the app can be fiddled with safely.

##end
-->
<!DOCTYPE html>

<html>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/head.php' ?>
    <script>
    $(document).ready(function(){
        init = {
            export_tree_script: '/export-tree.php',
            tutorial_enabled: false,
        }
        new Syntree.Workspace(init);
    });
    </script>

    <body class="page_make">

        <!-- <a href="index.php">
            <div class="button button_back">
            << Back
            </div>
        </a> -->

        <?php include $_SERVER['DOCUMENT_ROOT'] . '/app/workspace-div.html' ?>

    </body>
</html>