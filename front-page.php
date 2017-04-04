<!DOCTYPE html>

<html>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/head.php' ?>
    <script>
    $(document).ready(function(){
        init = {
            upload_enabled: false,
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
