<!DOCTYPE html>

<html>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/includes/head.php' ?>
    <script>
    $(document).ready(function(){
        alert("This is Andrew Zito's Division III project, working title: 'Syntree'. Please be aware that it is very much a work in progress.");
        init = {
            export_tree_script: '/post/export-tree.php',
            tutorial_enabled: true,
        }
        new Workspace(init);
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
