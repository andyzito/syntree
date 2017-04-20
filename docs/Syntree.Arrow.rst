.. _undefined.Arrow:

================
Class: ``Arrow``
================


.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   
Description
===========




.. _Syntree.Arrow.__recreate:


Function: ``__recreate``
========================



.. js:function:: __recreate()

    
    
.. _Syntree.Arrow.createGraphic:


Function: ``createGraphic``
===========================



.. js:function:: createGraphic()

    
    
.. _Syntree.Arrow.select:


Function: ``select``
====================



.. js:function:: select()

    
    
.. _Syntree.Arrow.getStartPoint:


Function: ``getStartPoint``
===========================



.. js:function:: getStartPoint()

    
    
.. _Syntree.Arrow.setStartPoint:


Function: ``setStartPoint``
===========================



.. js:function:: setStartPoint()

    
    
.. _Syntree.Arrow.setEndPoint:


Function: ``setEndPoint``
=========================



.. js:function:: setEndPoint()

    
    
.. _Syntree.Arrow.getEndPoint:


Function: ``getEndPoint``
=========================



.. js:function:: getEndPoint()

    
    
.. _Syntree.Arrow.toString:


Function: ``toString``
======================



.. js:function:: toString()

    
    
.. _Syntree.Arrow.__updateGraphics:


Function: ``__updateGraphics``
==============================



.. js:function:: __updateGraphics()

    
    
.. _Syntree.Arrow.__delete:


Function: ``__delete``
======================



.. js:function:: __delete()

    
    
.. _Syntree.Arrow.getStartCtrlPoint:


Function: ``getStartCtrlPoint``
===============================



.. js:function:: getStartCtrlPoint()

    
    
.. _Syntree.Arrow.setStartCtrlPoint:


Function: ``setStartCtrlPoint``
===============================



.. js:function:: setStartCtrlPoint()

    
    
.. _Syntree.Arrow.setEndCtrlPoint:


Function: ``setEndCtrlPoint``
=============================



.. js:function:: setEndCtrlPoint()

    
    
.. _Syntree.Arrow.getEndCtrlPoint:


Function: ``getEndCtrlPoint``
=============================



.. js:function:: getEndCtrlPoint()

    
    
.. _Syntree.Arrow.getId:


Function: ``getId``
===================

Accessor function for property id.

.. js:function:: getId()

    
    :return number: the id of the element
    
.. _Syntree.Arrow.isDeleted:


Function: ``isDeleted``
=======================

Accessor function for property deleted.

.. js:function:: isDeleted()

    
    :return boolean: whether or not the element is deleted
    
.. _Syntree.Arrow.isSelectable:


Function: ``isSelectable``
==========================

Accessor function for property selectable.

.. js:function:: isSelectable()

    
    :return boolean: whether or not the element is selectable
    
.. _Syntree.Arrow.delete:


Function: ``delete``
====================

Delete the element.
Removes graphical elements, deregisters from Syntree.Workspace.page, and sets deleted property to true.
Extend in sub-classes with '__delete()'.

.. js:function:: delete()

    
    
.. _Syntree.Arrow.updateGraphics:


Function: ``updateGraphics``
============================

Update the elements graphical representation.
Mostly serves as a wrapper for Syntree.Graphic.update.
Extend in sub-classes with '__updateGraphics()'.

.. js:function:: updateGraphics()

    
    
.. _Syntree.Arrow.isElement:


Function: ``isElement``
=======================

Whether or not this object is an element.
Elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.

.. js:function:: isElement()

    
    :return boolean: Whether or not this object is an element.
    Elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.
    
.. _Syntree.Arrow.isDeletable:


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
    
.. _Syntree.Arrow.select:


Function: ``select``
====================

Select the element.
Controls the appearance and behavior of <strong>this element only</strong>.
Deselecting previously selected element and other overarching management is handled by Syntree.Page.

.. js:function:: select()

    
    
.. _Syntree.Arrow.deselect:


Function: ``deselect``
======================

Deselect the element.
Controls the appearance and behavior of <strong>this element only</strong>.
Other overarching management is handled by Syntree.Page.

.. js:function:: deselect()

    
    

.. _Syntree.Arrow.id:

Member: ``id``: 

.. _Syntree.Arrow.graphic:

Member: ``graphic``: 

.. _Syntree.Arrow.selected:

Member: ``selected``: 

.. _Syntree.Arrow.id:

Member: ``id``: A session-unique id.

.. _Syntree.Arrow.selectable:

Member: ``selectable``: Whether or not this element is selectable.
Selectable elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.

.. _Syntree.Arrow.deleted:

Member: ``deleted``: Whether or not this element has been deleted.
Needed to avoid double deletion.

.. _Syntree.Arrow.selected:

Member: ``selected``: Whether or not this element is selected.




