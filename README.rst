Syntree (working title)
==================================================
Syntree is a web app that allows the user to draw syntax trees using a GUI interface, as opposed to bracket notation.

For more information on what Syntree *is* in the big picture sense, `see the FAQ and Help page <http://syntree.stdnt.hampshire.edu/pages/what.php>`_.

For more information on how Syntree *works*, read through the READMEs here, and `see the code documentation <http://syntree.stdnt.hampshire.edu/docs>`_.

*Note: the READMEs have basic information about the directory structure of this project, and some of the entities that are outside the actual JavaScript app itself. In depth information on the classes, methods, and structure of the app itself are in the aforementioned code docs.*

Export Tree
--------------------------------------------------
`./export-tree.php <./export-tree.php>`_

This is a script which takes a string identifying the type of file to export, and a filename to use. It returns a link to the generated file.

Splash Page
--------------------------------------------------
`./index.php <./index.php>`_

The splash page of the Syntree website

Head
--------------------------------------------------
`./head.php <./head.php>`_

Included on every page. Imports external libraries, all app scripts, and styles.

`Docs <./docs/README.rst>`_
--------------------------------------------------
`./docs <./docs>`_

All documentation besides the READMEs and the end user help page.

`Pages <./pages/README.rst>`_
--------------------------------------------------
`./pages <./pages>`_

All pages of the Syntree website.

`Style <./style/README.rst>`_
--------------------------------------------------
`./style <./style>`_

Contains SCSS, gulpfile for generating CSS.

`App <./app/README.rst>`_
--------------------------------------------------
`./app <./app>`_

This directory contains the JavaScript code for the application itself (as opposed to the website that hosts it).

Resources
--------------------------------------------------
`./resources <./resources>`_

Images or any other media resource required by Syntree.

On Hold
--------------------------------------------------
`./on_hold <./on_hold>`_

This is all functionality (and the code related to it) that is on hold. Please do not look at, touch, or think too hard about _anything_ in this folder.

