<!--
##file_doc

@title Splash Page
@description The splash page of the Syntree website

##end
-->
<!DOCTYPE html>

<html>
    <?php include './head.php'; ?>

    <body class="splash">
        <h3 class="page_title">Syntree</h3>
        <h5 class="page_title page_title_secondary">The Division III Project of Andrew Zito</h5>

        <div class="block_menu">
            <ul>
                <a href="<?php echo WEBROOT ?>/pages/app-page.php"><li><i class="fa fa-tree" aria-hidden="true"></i>Check it out! (Make a Tree)</li></a>
                <a href="<?php echo WEBROOT ?>/pages/what.php"><li><i class="fa fa-question-circle" aria-hidden="true"></i>What is this? (FAQ & Help)</li></a>
                <a href="<?php echo WEBROOT ?>/docs/"><li><i class="fa fa-book" aria-hidden="true"></i>Documentation</li></a>
            </ul>
        </div>
    </body>
</html>
