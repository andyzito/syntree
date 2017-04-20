.. _undefined.Branch:

=================
Class: ``Branch``
=================


.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   
Description
===========




.. _Syntree.Branch.createGraphic:


Function: ``createGraphic``
===========================



.. js:function:: createGraphic()

    
    
.. _Syntree.Branch.toString:


Function: ``toString``
======================



.. js:function:: toString()

    
    
.. _Syntree.Branch.__delete:


Function: ``__delete``
======================



.. js:function:: __delete()

    
    
.. _Syntree.Branch.getMidPoint:


Function: ``getMidPoint``
=========================



.. js:function:: getMidPoint()

    
    
.. _Syntree.Branch.triangleToggle:


Function: ``triangleToggle``
============================



.. js:function:: triangleToggle()

    
    
.. _Syntree.Branch.getStartPoint:


Function: ``getStartPoint``
===========================



.. js:function:: getStartPoint()

    
    
.. _Syntree.Branch.getEndPoint:


Function: ``getEndPoint``
=========================



.. js:function:: getEndPoint()

    
    
.. _Syntree.Branch.getTrianglePath:


Function: ``getTrianglePath``
=============================



.. js:function:: getTrianglePath()

    
    
.. _Syntree.Branch.getId:


Function: ``getId``
===================

Accessor function for property id.

.. js:function:: getId()

    
    :return number: the id of the element
    
.. _Syntree.Branch.isDeleted:


Function: ``isDeleted``
=======================

Accessor function for property deleted.

.. js:function:: isDeleted()

    
    :return boolean: whether or not the element is deleted
    
.. _Syntree.Branch.isSelectable:


Function: ``isSelectable``
==========================

Accessor function for property selectable.

.. js:function:: isSelectable()

    
    :return boolean: whether or not the element is selectable
    
.. _Syntree.Branch.delete:


Function: ``delete``
====================

Delete the element.
Removes graphical elements, deregisters from Syntree.Workspace.page, and sets deleted property to true.
Extend in sub-classes with '__delete()'.

.. js:function:: delete()

    
    
.. _Syntree.Branch.updateGraphics:


Function: ``updateGraphics``
============================

Update the elements graphical representation.
Mostly serves as a wrapper for Syntree.Graphic.update.
Extend in sub-classes with '__updateGraphics()'.

.. js:function:: updateGraphics()

    
    
.. _Syntree.Branch.isElement:


Function: ``isElement``
=======================

Whether or not this object is an element.
Elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.

.. js:function:: isElement()

    
    :return boolean: Whether or not this object is an element.
    Elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.
    
.. _Syntree.Branch.isDeletable:


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
    
.. _Syntree.Branch.select:


Function: ``select``
====================

Select the element.
Controls the appearance and behavior of <strong>this element only</strong>.
Deselecting previously selected element and other overarching management is handled by Syntree.Page.

.. js:function:: select()

    
    
.. _Syntree.Branch.deselect:


Function: ``deselect``
======================

Deselect the element.
Controls the appearance and behavior of <strong>this element only</strong>.
Other overarching management is handled by Syntree.Page.

.. js:function:: deselect()

    
    

.. _Syntree.Branch.parent:

Member: ``parent``: 

.. _Syntree.Branch.child:

Member: ``child``: 

.. _Syntree.Branch.parent:

Member: ``parent``: 

.. _Syntree.Branch.child:

Member: ``child``: 

.. _Syntree.Branch.triangle:

Member: ``triangle``: 

.. _Syntree.Branch.startPoint:

Member: ``startPoint``: 

.. _Syntree.Branch.endPoint:

Member: ``endPoint``: 

.. _Syntree.Branch.graphic:

Member: ``graphic``: 

.. _Syntree.Branch.triangle:

Member: ``triangle``: 

.. _Syntree.Branch.triangle:

Member: ``triangle``: 

.. _Syntree.Branch.id:

Member: ``id``: A session-unique id.

.. _Syntree.Branch.selectable:

Member: ``selectable``: Whether or not this element is selectable.
Selectable elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.

.. _Syntree.Branch.deleted:

Member: ``deleted``: Whether or not this element has been deleted.
Needed to avoid double deletion.

.. _Syntree.Branch.selected:

Member: ``selected``: Whether or not this element is selected.




