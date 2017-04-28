Use Case #3: Deleting Nodes
===========================

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
