<!--
##file_doc

@title Scripts
@description All the scripts for the app, imported in the right order.

##end
-->
<script src='http://ariutta.github.io/svg-pan-zoom/dist/svg-pan-zoom.min.js'></script>
<?php
    echo "<script src = '" . WEBROOT . "/app/external_libs/jquery-3.2.0.min.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/external_libs/rgbcolor.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/external_libs/StackBlur.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/external_libs/canvg.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/external_libs/snap.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/modal.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/singletons/lib.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/singletons/tutorial.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/singletons/toolbar.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/singletons/history.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/singletons/workspace.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/classes/action.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/classes/page.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/classes/tree.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/classes/elements/node.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/classes/elements/branch.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/classes/elements/arrow.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/classes/elements/element.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/classes/elements/selectableElement.js'></script>";
    echo "<script src = '" . WEBROOT . "/app/classes/elements/graphic.js'></script>";
?>
<script>
    $(document).ready(function() {
        $('#workspace_container .loading_screen').remove();
    });
</script>
<!-- ------------------------------------ -->
