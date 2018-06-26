App
==================================================
This directory contains the JavaScript code for the application itself (as opposed to the website that hosts it).

For the most part, the application itself is separable from the website instance (meaning that it could, in theory, be embedded in another web-page). The exceptions to this are the `resources` folder, and the `export-tree.php` script.

Scripts
--------------------------------------------------
`./app/scripts.php <./app/scripts.php>`_

All the scripts for the app, imported in the right order.

`External Libraries <./app/external_libs/README.rst>`_
--------------------------------------------------
`./app/external_libs <./app/external_libs>`_

External libraries required by Syntree.

Workspace Container
--------------------------------------------------
`./app/workspace-div.php <./app/workspace-div.php>`_

This html file is the markup on which the app hangs. All the JavaScript classes and objects rely on this markup. It contains things like the SVG element, the <canvas> used for image exporting, and many of the modals.
