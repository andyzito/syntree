Use Case #4: Exporting a Tree
=============================

.. This use case was selected from the original pool of use cases, and updated to match the current version of Syntree. You can view all the original, unaltered use cases at https://drive.google.com/open?id=0ByxFokfIIBmXbzRSdTBIWThfeTg

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