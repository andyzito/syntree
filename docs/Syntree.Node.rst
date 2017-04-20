.. _undefined.Node:

===============
Class: ``Node``
===============


.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   
Description
===========




.. _Syntree.Node.createGraphic:


Function: ``createGraphic``
===========================



.. js:function:: createGraphic()

    
    
.. _Syntree.Node.getPosition:


Function: ``getPosition``
=========================



.. js:function:: getPosition()

    
    
.. _Syntree.Node.getLabelContent:


Function: ``getLabelContent``
=============================



.. js:function:: getLabelContent()

    
    
.. _Syntree.Node.setLabelContent:


Function: ``setLabelContent``
=============================



.. js:function:: setLabelContent()

    
    
.. _Syntree.Node.getLabelBBox2:


Function: ``getLabelBBox2``
===========================



.. js:function:: getLabelBBox2()

    
    
.. _Syntree.Node.getLabelBBox:


Function: ``getLabelBBox``
==========================



.. js:function:: getLabelBBox()

    
    
.. _Syntree.Node.getParent:


Function: ``getParent``
=======================



.. js:function:: getParent()

    
    
.. _Syntree.Node.getChildren:


Function: ``getChildren``
=========================



.. js:function:: getChildren()

    
    
.. _Syntree.Node.getPath:


Function: ``getPath``
=====================



.. js:function:: getPath()

    
    
.. _Syntree.Node.getState:


Function: ``getState``
======================



.. js:function:: getState()

    
    
.. _Syntree.Node.getSVGString:


Function: ``getSVGString``
==========================



.. js:function:: getSVGString()

    
    
.. _Syntree.Node.move:


Function: ``move``
==================



.. js:function:: move()

    
    
.. _Syntree.Node.__delete:


Function: ``__delete``
======================



.. js:function:: __delete()

    
    
.. _Syntree.Node.__deselect:


Function: ``__deselect``
========================



.. js:function:: __deselect()

    
    
.. _Syntree.Node.editingAction:


Function: ``editingAction``
===========================



.. js:function:: editingAction()

    
    
.. _Syntree.Node.__updateGraphics:


Function: ``__updateGraphics``
==============================



.. js:function:: __updateGraphics()

    
    
.. _Syntree.Node.addChild:


Function: ``addChild``
======================



.. js:function:: addChild()

    
    
.. _Syntree.Node.detachChild:


Function: ``detachChild``
=========================



.. js:function:: detachChild()

    
    
.. _Syntree.Node.toString:


Function: ``toString``
======================



.. js:function:: toString()

    
    
.. _Syntree.Node.getId:


Function: ``getId``
===================

Accessor function for property id.

.. js:function:: getId()

    
    :return number: the id of the element
    
.. _Syntree.Node.isDeleted:


Function: ``isDeleted``
=======================

Accessor function for property deleted.

.. js:function:: isDeleted()

    
    :return boolean: whether or not the element is deleted
    
.. _Syntree.Node.isSelectable:


Function: ``isSelectable``
==========================

Accessor function for property selectable.

.. js:function:: isSelectable()

    
    :return boolean: whether or not the element is selectable
    
.. _Syntree.Node.delete:


Function: ``delete``
====================

Delete the element.
Removes graphical elements, deregisters from Syntree.Workspace.page, and sets deleted property to true.
Extend in sub-classes with '__delete()'.

.. js:function:: delete()

    
    
.. _Syntree.Node.updateGraphics:


Function: ``updateGraphics``
============================

Update the elements graphical representation.
Mostly serves as a wrapper for Syntree.Graphic.update.
Extend in sub-classes with '__updateGraphics()'.

.. js:function:: updateGraphics()

    
    
.. _Syntree.Node.isElement:


Function: ``isElement``
=======================

Whether or not this object is an element.
Elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.

.. js:function:: isElement()

    
    :return boolean: Whether or not this object is an element.
    Elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.
    
.. _Syntree.Node.isDeletable:


Function: ``isDeletable``
=========================

Whether or not this element is deletable.
Deletable elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.
Syntree.Branch should never be deletable directly by the user.
Branches should only be deleted automatically when their child node is deleted.

.. js:function:: isDeletable()

    
    :return boolean: Whether or not this element is deletable.
    Deletable elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.
    Syntree.Branch should never be deletable directly by the user.
    Branches should only be deleted automatically when their child node is deleted.
    
.. _Syntree.Node.select:


Function: ``select``
====================

Select the element.
Controls the appearance and behavior of <strong>this element only</strong>.
Deselecting previously selected element and other overarching management is handled by Syntree.Page.

.. js:function:: select()

    
    
.. _Syntree.Node.deselect:


Function: ``deselect``
======================

Deselect the element.
Controls the appearance and behavior of <strong>this element only</strong>.
Other overarching management is handled by Syntree.Page.

.. js:function:: deselect()

    
    

.. _Syntree.Node.lastSyncedPosition:

Member: ``lastSyncedPosition``: 

.. _Syntree.Node.parent:

Member: ``parent``: 

.. _Syntree.Node.children:

Member: ``children``: 

.. _Syntree.Node.parentBranch:

Member: ``parentBranch``: 

.. _Syntree.Node.childBranches:

Member: ``childBranches``: 

.. _Syntree.Node.editing:

Member: ``editing``: 

.. _Syntree.Node.real:

Member: ``real``: 

.. _Syntree.Node.graphic:

Member: ``graphic``: 

.. _Syntree.Node.labelContent:

Member: ``labelContent``: 

.. _Syntree.Node._labelbbox:

Member: ``_labelbbox``: 

.. _Syntree.Node.x:

Member: ``x``: 

.. _Syntree.Node.y:

Member: ``y``: 

.. _Syntree.Node._labelbbox:

Member: ``_labelbbox``: 

.. _Syntree.Node.real:

Member: ``real``: 

.. _Syntree.Node.editing:

Member: ``editing``: 

.. _Syntree.Node.beforeEditLabelContent:

Member: ``beforeEditLabelContent``: 

.. _Syntree.Node._labelbbox:

Member: ``_labelbbox``: 

.. _Syntree.Node._labelbbox:

Member: ``_labelbbox``: 

.. _Syntree.Node.real:

Member: ``real``: 

.. _Syntree.Node.editing:

Member: ``editing``: 

.. _Syntree.Node.beforeEditLabelContent:

Member: ``beforeEditLabelContent``: 

.. _Syntree.Node._labelbbox:

Member: ``_labelbbox``: 

.. _Syntree.Node.positionUnsynced:

Member: ``positionUnsynced``: 

.. _Syntree.Node.editing:

Member: ``editing``: 

.. _Syntree.Node.beforeEditLabelContent:

Member: ``beforeEditLabelContent``: 

.. _Syntree.Node._labelbbox:

Member: ``_labelbbox``: 

.. _Syntree.Node.id:

Member: ``id``: A session-unique id.

.. _Syntree.Node.selectable:

Member: ``selectable``: Whether or not this element is selectable.
Selectable elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.

.. _Syntree.Node.deleted:

Member: ``deleted``: Whether or not this element has been deleted.
Needed to avoid double deletion.

.. _Syntree.Node.selected:

Member: ``selected``: Whether or not this element is selected.




