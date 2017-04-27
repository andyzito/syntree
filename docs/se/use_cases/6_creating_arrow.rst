Use Case #1: Creating a Movement Arrow
======================================

Actors
------
- User (User)
- Syntree app (App)

Preconditions
-------------
- User has opened the application
- There is a child Node 'A' of the root Node 'S'
- There is a child Node 'B' of the root Node 'S'
- The child Node 'A' is the selected Node

Steps
-----
1. App: displays Node 'A' as highlighted, to show that it is selected

#. User: holds the CTRL key and clicks on Node 'B'

#. App: displays a dashed arrow curving from Node 'A' to Node 'B'

#. App: displays arrow as highlighted, to show that it is selected

#. App: displays one red and one blue circle representing the control points of the boolean curve that is the arrow's path

#. User: drags one of the control point markers

#. App: updates the arrow's path to match the changing control point