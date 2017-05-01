Requirements List
=================

Last updated on 22/02/17

This list is split into hierarchical categories. Requirements in Tier 1 are absolutely essential; requirements in Tier 2 are important but less essential, and so on. This categorization is based on my own goals. Tier 1 items should be prioritized over Tier 2 items, Tier 2 over Tier 3, etc.

.. Note: Requirements marked with an ! are those I added on my own, while all other requirements were derived from conversations with 'clients'. Requirements enclosed in "**" are those which have been implemented in the Syntree code.

Tier 1
------
- !Create nodes either with keyboard shortcuts or using the mouse

  - !Click in empty space to draw a new node connected to the nearest parent
  - **!Down arrow key = create child**
  - **!Left/right arrow keys = create sibling**
  - **!All arrow keys can also be used to navigate the tree**
  - **!Will automatically create a node if there is nothing to select**
  - **!Hold CTRL to force node creation (except on up arrow)**
  - **!When navigating to multiple children (down), goes to the one most recently selected or the left-most node**

- **!Nodes are positioned automatically**
- **!Nodes can be labelled**
- **!Subtrees can be deleted**
- **!Empty nodes are automatically removed (if you create them and then go back)**

Tier 2
------
- **Easily export/embed tree diagrams**

  - With different file formats

- **Save trees as special format that can be read back into the drawer (with formatting included)**
- Allow user to upload tree, or open one saved in db
- **Pan the view of the tree**
- !Convert visual tree to bracket notation and vice versa

  - **!Export as bracket notation (LaTeX syntax)**

Tier 3
------
- Delete intermediate nodes without deleting their children
- **Use triangles to represent abbreviated structure**
- **Represent syntactic movement with arrows**
- Draw multiple trees within one ‘page’
- Drag and drop nodes to new parents
- Copy/paste nodes and groups of nodes

Tier 4
------
- Zoom
- Be restricted to a certain library of production rules, for example, X-Bar theory
- Import previously created trees as fragments
- !Have multiple pages
- Format text fully

  - !Change node color/style as group(s)

- Remove a node from the flow of automatic line angling, positioning and anchoring it where the user desires
- Highlight dependency relationships (c-command, child/parent, etc.)
