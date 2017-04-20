.. _Syntree.Lib:

==============
Class: ``Lib``
==============

Member Of :doc:`Syntree`

.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   
Description
===========




.. _Syntree.Lib.config:


Function: ``config``
====================

Add properties to a given object, using that object's config_map property to check types and apply defaults.

.. js:function:: config(matrix, target)

    
    :param object matrix: An object of properties to be appended to the target
    :param object target: The object to be 'configured'
    
.. _Syntree.Lib.focusNoScroll:


Function: ``focusNoScroll``
===========================

Just a function that allows us to focus an element without auto-scrolling to it.
Useful if the app is embedded in a larger page.

.. js:function:: focusNoScroll(elem)

    
    :param jQuery_Object elem: A page element to scroll to
    
.. _Syntree.Lib.genId:


Function: ``genId``
===================

Generates a unique id (unique within this session).

.. js:function:: genId()

    
    :return number: a session-unique id
    
.. _Syntree.Lib.typeOf:


Function: ``typeOf``
====================

Get the type of anything, taking into account all kinds of JS type weirdness.
Returns undefined for NaN and null. Returns specific object type if available, 'object' otherwise.

.. js:function:: typeOf()

    
    :param typeOf(): any value
    :return string: the type of the passed value
    
.. _Syntree.Lib.checkType:


Function: ``checkType``
=======================

Check a value against any given type(s).

.. js:function:: checkType(, required_type)

    
    :param checkType(, required_type): any value
    :param string|Array.<string> required_type: a string representing the required type, or an array of such strings
    :return boolean: whether the passed value matched the required type(s)
    
.. _Syntree.Lib.checkArg:


Function: ``checkArg``
======================

Ideal for checking argument types. Checks the passed value against the required type,
and returns the default value instead if the check doesn't pass.
A default value of '#undefined' will permit the type check to fail, and return nothing.
Otherwise (if default_value is actually undefined), will throw an error on type check failure.

.. js:function:: checkArg(, require)

    
    :param checkArg(, require): any value
    :param string|Array.<string>|function require: a string representing the required type, an array of such strings, or a function returning true/false
    :param checkArg(, require): any value, to be returned if the type check fails
    
.. _Syntree.Lib.distance:


Function: ``distance``
======================

Get the distance between two points.

.. js:function:: distance(x1_or_obj[, y1][, x2][, y2])

    
    :param number|object x1_or_obj: either the x coordinate of point 1, or an object representing all four coordinates
    :param number y1: the y coordinate of point 1
    :param number x2: the x coordinate of point 2
    :param number y2: the y coordinate of point 2
    :return number: the distance between the two points
    
.. _Syntree.Lib.capitalize:


Function: ``capitalize``
========================

Capitalize the first letter of a string.
Often used for converting types into corresponding constructor function identifiers.

.. js:function:: capitalize(string)

    
    :param string string: any string
    :return string: the passed string, with the first letter capitalized
    
.. _Syntree.Lib.getMidPoint:


Function: ``getMidPoint``
=========================

Get the mid point of a line spanning two points

.. js:function:: getMidPoint(x1_or_obj[, y1][, x2][, y2])

    
    :param number|object x1_or_obj: either the x coordinate of point 1, or an object representing all four coordinates
    :param number y1: the y coordinate of point 1
    :param number x2: the x coordinate of point 2
    :param number y2: the y coordinate of point 2
    :return object: - the x/y coordinates of the mid point
    

.. _Syntree.Lib.allIds:

Member: ``allIds``: Keeps track of ids that have been generated.

.. _Syntree.Lib.idN:

Member: ``idN``: The upper bound of random number generation for ids.
Increases if we get too close.




