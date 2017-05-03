<!--
##file_doc

@title App Page
@description The main page for the app itself.

##end
-->
<!DOCTYPE html>

<html>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/head.php' ?>
    <script>
    $(document).ready(function(){
        init = {
            upload_enabled: true,
            tutorial_enabled: true,
            export_tree_script: '/export-tree.php',
        }
        new Syntree.initialize(init);
    });
    </script>

    <body class="page_make">

        <?php include $_SERVER['DOCUMENT_ROOT'] . '/app/workspace-div.html' ?>

    </body>
</html>
