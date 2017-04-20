.. _undefined.Page:

===============
Class: ``Page``
===============


.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   
Description
===========




.. _Syntree.Page.register:


Function: ``register``
======================



.. js:function:: register()

    
    
.. _Syntree.Page.deregister:


Function: ``deregister``
========================



.. js:function:: deregister()

    
    
.. _Syntree.Page.select:


Function: ``select``
====================



.. js:function:: select()

    
    
.. _Syntree.Page.deselect:


Function: ``deselect``
======================



.. js:function:: deselect()

    
    
.. _Syntree.Page.deleteTree:


Function: ``deleteTree``
========================



.. js:function:: deleteTree()

    
    
.. _Syntree.Page.isRegistered:


Function: ``isRegistered``
==========================



.. js:function:: isRegistered()

    
    
.. _Syntree.Page.getSelected:


Function: ``getSelected``
=========================



.. js:function:: getSelected()

    
    
.. _Syntree.Page.getElementsByType:


Function: ``getElementsByType``
===============================



.. js:function:: getElementsByType()

    
    
.. _Syntree.Page.createMovementArrow:


Function: ``createMovementArrow``
=================================

Create a movement arrow from the selected [Node]{@link Syntree.Node} to the clicked [Node]{@link Syntree.Node}.

.. js:function:: createMovementArrow(node)

    
    :param Syntree.Node node: the node that was clicked
    
.. _Syntree.Page.addTree:


Function: ``addTree``
=====================

Add a tree to the page.
If you do not provide a parent [Node]{@link Syntree.Node}, the main tree will be replaced.

.. js:function:: addTree(tree[, parent][, index])

    
    :param Syntree.Tree tree: the Tree object to add.
    :param Syntree.Node parent: the Node to which the root of the Tree will be added
    :param number index: the index at which to add the root of Tree
    
.. _Syntree.Page.openTree:


Function: ``openTree``
======================

Create a [Tree]{@link Syntree.Tree} from a treestring, and then add it to the page.
If you do not provide a parent [Node]{@link Syntree.Node}, the main tree will be replaced.

.. js:function:: openTree(treestring[, parent][, index])

    
    :param Syntree.Tree treestring: the treestring which the Tree will build from
    :param Syntree.Node parent: the Node to which the root of the Tree will be added
    :param number index: the index at which to add the root of Tree
    
.. _Syntree.Page.getSVGString:


Function: ``getSVGString``
==========================

Get a string of SVG markup representing all marked objects on the page.

.. js:function:: getSVGString()

    
    :return string: Get a string of SVG markup representing all marked objects on the page.
    
.. _Syntree.Page.getNearestNode:


Function: ``getNearestNode``
============================



.. js:function:: getNearestNode()

    
    
.. _Syntree.Page.navigateHorizontal:


Function: ``navigateHorizontal``
================================



.. js:function:: navigateHorizontal()

    
    
.. _Syntree.Page.navigateUp:


Function: ``navigateUp``
========================



.. js:function:: navigateUp()

    
    
.. _Syntree.Page.navigateDown:


Function: ``navigateDown``
==========================



.. js:function:: navigateDown()

    
    
.. _Syntree.Page.nodeEditing:


Function: ``nodeEditing``
=========================



.. js:function:: nodeEditing()

    
    
.. _Syntree.Page.toString:


Function: ``toString``
======================



.. js:function:: toString()

    
    

.. _Syntree.Page.background:

Member: ``background``: The <rect> which is the background of the page.

.. _Syntree.Page.allElements:

Member: ``allElements``: 

.. _Syntree.Page.selectedElement:

Member: ``selectedElement``: 

.. _Syntree.Page.allElements[undefined]:

Member: ``allElements[undefined]``: 

.. _Syntree.Page.selectedElement:

Member: ``selectedElement``: 

.. _Syntree.Page.selectedElement:

Member: ``selectedElement``: 

.. _Syntree.Page.tree:

Member: ``tree``: 

.. _Syntree.Page.tree:

Member: ``tree``: 




