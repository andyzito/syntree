Use Case #4: Exporting a Tree
=============================

Actors
------
- User (User)
- Syntree app (App)

Preconditions
-------------
- User has opened the application
- User has created a Tree

Steps
-----
#. User: clicks "Export" button in the toolbar

#. App: displays modal dialog containing:

   - a list of radio inputs labeled with different file types
   - a text input with content "myfile .txt"
   - buttons labelled "Export" and "Cancel"

#. User: clicks radio input for desired file type

#. App: displays file name input as having the file type extension matching User's selection

#. User: types in desired file name in text input

#. User: clicks "Export" button in modal dialog

#. App: downloads file to User's computer, via built-in browser functionality