Use Case #2: Forcing Node Creation
==================================

Actors
------
- User (User)
- Syntree app (App)

Preconditions
-------------
- User has opened the application
- There is a child Node 'NP' of the root Node 'S'
- There is a child Node 'VP' of the root Node 'S'
- The child Node 'NP' is the selected Node

Steps
-----
#. User: holds the CTRL and SHIFT keys and presses the left arrow key, to force creation of a child Node

#. App: rather than navigating to the existing sibling Node 'VP', displays a new Node in between the Node 'NP' and the Node 'VP'

#. App: displays all three child Nodes equidistant from one another, forming an equilateral triangle shape with the root Node 'S'

#. App: sets focus to the new child Node’s editor

#. User: labels the new child Node 'A' and presses enter

#. App: displays new child Node 'A' as highlighted to show that it is selected