.. _undefined.SelectableElement:

============================
Class: ``SelectableElement``
============================


.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   
Description
===========




.. _Syntree.SelectableElement.select:


Function: ``select``
====================

Select the element.
Controls the appearance and behavior of <strong>this element only</strong>.
Deselecting previously selected element and other overarching management is handled by Syntree.Page.

.. js:function:: select()

    
    
.. _Syntree.SelectableElement.deselect:


Function: ``deselect``
======================

Deselect the element.
Controls the appearance and behavior of <strong>this element only</strong>.
Other overarching management is handled by Syntree.Page.

.. js:function:: deselect()

    
    
.. _Syntree.SelectableElement.getId:


Function: ``getId``
===================

Accessor function for property id.

.. js:function:: getId()

    
    :return number: the id of the element
    
.. _Syntree.SelectableElement.isDeleted:


Function: ``isDeleted``
=======================

Accessor function for property deleted.

.. js:function:: isDeleted()

    
    :return boolean: whether or not the element is deleted
    
.. _Syntree.SelectableElement.isSelectable:


Function: ``isSelectable``
==========================

Accessor function for property selectable.

.. js:function:: isSelectable()

    
    :return boolean: whether or not the element is selectable
    
.. _Syntree.SelectableElement.delete:


Function: ``delete``
====================

Delete the element.
Removes graphical elements, deregisters from Syntree.Workspace.page, and sets deleted property to true.
Extend in sub-classes with '__delete()'.

.. js:function:: delete()

    
    
.. _Syntree.SelectableElement.updateGraphics:


Function: ``updateGraphics``
============================

Update the elements graphical representation.
Mostly serves as a wrapper for Syntree.Graphic.update.
Extend in sub-classes with '__updateGraphics()'.

.. js:function:: updateGraphics()

    
    
.. _Syntree.SelectableElement.isElement:


Function: ``isElement``
=======================

Whether or not this object is an element.
Elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.

.. js:function:: isElement()

    
    :return boolean: Whether or not this object is an element.
    Elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.
    
.. _Syntree.SelectableElement.isDeletable:


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
    

.. _Syntree.SelectableElement.selectable:

Member: ``selectable``: 

.. _Syntree.SelectableElement.selected:

Member: ``selected``: Whether or not this element is selected.

.. _Syntree.SelectableElement.selected:

Member: ``selected``: 

.. _Syntree.SelectableElement.selected:

Member: ``selected``: 

.. _Syntree.SelectableElement.id:

Member: ``id``: A session-unique id.

.. _Syntree.SelectableElement.selectable:

Member: ``selectable``: Whether or not this element is selectable.
Selectable elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.

.. _Syntree.SelectableElement.deleted:

Member: ``deleted``: Whether or not this element has been deleted.
Needed to avoid double deletion.




