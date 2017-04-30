Class Analysis of Use Case #1: Creating a Syntax Tree
=====================================================

This is a historical document (from November 2016). It may have some out of date terms or other idiosyncrasies compared to updated documents like Use Cases or the Class Diagram.

Nouns
-----
- GUI
- User
- Node

  - Root node
  - Child node
  - Sibling node

- Textbox
- Border
- Syntax tree

Analysis
--------
I have established that Node is probably the most important class here. A syntax tree is composed of nodes and an overwhelming majority of the operation involve interactions between Nodes. The noun ‘textbox’ is referring to the visual representation of a node in the GUI, so we can encapsulate that within the Node class. Similarly with the border or highlight. As to the various types of nodes, these are best represented as Node instances with different properties and relations to one another.

The second most important class here will be the (syntax) Tree class. It will serve as a way to hold the nodes as a mapped collection rather than what amounts to a linked list. It will also serve to hold methods that operate on large numbers of nodes in a non-transversal way, such as retrieving nodes at a certain offset from the root. Furthermore, it can carry state variables such as the currently selected node.

The user is the user, and within the syntax tree drawer itself there is no reason to represent them in code (this will change when it comes to the website itself).

The GUI itself can be thought of as several components, specifically the SVG workspace and the elements within it, the Snap.svg javascript library which allows for easier SVG manipulation, and the various functions of jQuery which allow for other visual manipulations. It remains to be seen whether having these various visual tools encapsulated in a single class would be useful. As of now they exist as an implicit layer in between any underlying classes and the output the user sees. Of particular concern are event listeners, which can also be thought of as part of the GUI, but have no real home in the code as of now.
