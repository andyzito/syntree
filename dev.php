<!DOCTYPE html>

<html>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/head.php' ?>
    <script>
    $(document).ready(function(){
        init = {
            export_tree_script: '/export-tree.php',
            tutorial_enabled: false,
        }
        new Syntree.workspace_constructor(init);
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