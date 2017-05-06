Use Case #3: Deleting Nodes
===========================

.. This use case was selected from the original pool of use cases, and updated to match the current version of Syntree. You can view all the original, unaltered use cases at https://drive.google.com/open?id=0ByxFokfIIBmXbzRSdTBIWThfeTg

Actors
------
- User (User)
- Syntree app (App)

Preconditions
-------------
- User has opened the application
- There is a tree with many Nodes

Steps
-----
#. User: selects a Node which has both a parent and at least one child

#. App: displays this Node as selected

#. User: presses either "Backspace" or "Delete" key, or clicks the small 'x' button to the top right of the Node

#. App: removes the selected Node and all its descendants from the display
