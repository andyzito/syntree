<!DOCTYPE html>

<html>
    <?php include 'includes/head.php' ?>
    <body>
        <div class="overlay" overlay-id="index"></div>
        
        <div id="main">
            
            <?php include 'includes/modal_create-account.php' ?>
            <?php include 'includes/modal_login.php' ?>

            <div class="container container_logo">
                <img src="resources/syntree-logo.png">
            </div>

            <nav class="navbar navbar_main">
                <?php print($R->navbar()); ?>
            </nav>

            <h1>Try it! Right here:</h1>
            <?php include 'app/workspace-div.html' ?>
            
        </div>
    </body>
</html>