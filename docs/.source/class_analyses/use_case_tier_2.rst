Class Analysis of Tier 2 Use Cases (#4 and #5)
========================================================

This is a historical document, from November 2016. It may have some out of date terms or other idiosyncrasies compared to updated documents like Use Cases or the Class Diagram.

Nouns from Tier 2 Use Cases (that do not appear in Tier 1)
----------------------------------------------------------
- Button
- Alert
  - Message
  - Button
- File dialog
- File
- Menu
  - Dropdown menu
- Dialog
- File type
- Base node
- Option(s)
- “Shadow” tree

Analysis
--------
Several of these are clearly graphical elements (button, alert) that really don’t have a clear place to reside in the class diagram as it is. There are several graphical elements so far, existing as properties of Node and Workspace and Branch. The issue is further complicated by the fact that things like buttons may be implemented as HTML elements rather than SVG elements. It is likely that Button would be a good class, and possibly Alert as well (although this might also be a method of Workspace). In any case, it is clear that some restructuring will be needed to accommodate the multiplication of graphical elements.

“File dialog” should not need to be represented in our custom code, as it is built into the browser and we are just accessing it. Custom dialogs, on the other hand, (see exporting use cases) will likely need their own class. This would suggest that having Alerts be a method of Workspace is not the right way to go, and instead we might want to lean towards something like an overarching Modal class (which has child classes Alert and Dialog and etc.).

Menus are yet another graphical element that needs to be handled. Perhaps we need to simply make a Graphic class, from which all graphical elements that need to be represented in code can use. At the very least, such a class for controls (as opposed to pieces of the tree) might be a good idea.

The “shadow” tree is particularly difficult. At first it might be tempting to think of it as a method of Tree, but the fact is that it can be called on subtrees as well and how are we to deal with that? It is obviously ridiculous to make every subtree a Tree with it’s own shadow method (consider the number of possible subtrees for even a moderately sized Tree). Potentially this shadow tree could be categorized as a graphical interaction and thus handled by Workspace or another graphical management class.
