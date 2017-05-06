Use Case #1: Creating a Syntax Tree
===================================

.. This use case was selected from the original pool of use cases, and updated to match the current version of Syntree. You can view all the original, unaltered use cases at https://drive.google.com/open?id=0ByxFokfIIBmXbzRSdTBIWThfeTg

Actors
------
- User (User)
- Syntree app (App)

Preconditions
-------------
- User has opened the application

Steps
-----
1. App: displays a single Node with label 'S'

#. App: displays Node 'S' as highlighted, to indicate that it is the selected Node

#. User: presses the down arrow key, to create a child node

#. App: displays a new node a set distance down from the root Node 'S'

#. App: sets focus to a text box (editor) which visually represents the new child Node

#. User: types in the child Node’s editor, labelling it 'NP'

#. User: presses enter to confirm the edit

#. App: displays the child Node as just text (no text box), reading 'NP'

#. App: displays Node 'NP' as highlighted, to show that it is selected

#. User: presses the right arrow key, to create a sibling Node

#. App: displays Node 'NP' as shifted to the left, and a new child Node to the right, forming an equilateral triangle with the root Node 'S'

#. App: sets focus to a text box (editor) which visually represents the new child Node

#. User: labels the new child Node 'VP' and presses enter

#. App: displays Node 'VP' as highlighted, to show that it is selected

#. User: presses the left arrow key to navigate back to Node 'NP'

#. App: displays Node 'NP' as highlighted to show that it is selected

#. User: presses the down arrow key to create a child Node

#. User: draws the rest of the syntax tree, using the methods from steps 3 - 17