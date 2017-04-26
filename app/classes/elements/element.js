/**
 * @constructor
 * @classdesc An element in Syntree is any object that has a graphical representation and is related to the data of the tree. For example, a Node is an element, but the toolbar is not. Elements are Syntree.Node, Syntree.Branch, and Syntree.Arrow.
 */
Syntree.Element = function() {

    // Properties/Members------------------
    if (!Syntree.Lib.checkType(this.id, 'number')) {
        /**
         * A session-unique id.
         * @type {number}
         */
        this.id = Syntree.Lib.genId();
    }

    /**
     * Whether or not this element is selectable.
     * Selectable elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.
     *
     * @see Syntree.Element#isSelectable
     */
    this.selectable = false;

    /**
     * Whether or not this element has been deleted.
     * Needed to avoid double deletion.
     *
     * @type {boolean}
     */
    this.deleted = false;
    // -------------------------------------

    this.createGraphic();
    Syntree.Workspace.page.register(this);
}

// Accessor functions -------------------

/**
 * Accessor function for property deleted.
 *
 * @returns {boolean} whether or not the element is deleted
 * @see Syntree.Element.deleted;
 */
Syntree.Element.prototype.isDeleted = function() {
    return this.deleted;
}

/**
 * Accessor function for property selectable.
 *
 * @returns {boolean} whether or not the element is selectable
 * @see Syntree.Element#selectable
 */
Syntree.Element.prototype.isSelectable = function() {
    return this.selectable;
}
// ------------------------------------

/**
 * Delete the element.
 * Removes graphical elements, deregisters from Syntree.Workspace.page, and sets deleted property to true.
 * Extend in sub-classes with '__delete()'.
 *
 * @see Syntree.Element#deleted
 * @see Syntree.Element#isDeleted
 */
Syntree.Element.prototype.delete = function() {
    if (this.deleted) {
        return;
    }
    if (Syntree.Lib.checkType(this.__delete, 'function')) {
        this.__delete();
    }
    this.graphic.delete();
    Syntree.Workspace.page.deregister(this);
    this.deleted = true;
}

/**
 * Update the elements graphical representation.
 * Mostly serves as a wrapper for Syntree.Graphic.update.
 * Extend in sub-classes with '__updateGraphics()'.
 *
 * @see Syntree.Graphic
 */
Syntree.Element.prototype.updateGraphics = function() {
    this.graphic.update();
    if (Syntree.Lib.checkType(this.__updateGraphics, 'function')) {
        this.__updateGraphics(true);
    }
}

/**
 * Whether or not this object is an element.
 * Elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.
 *
 * @returns {boolean}
 */
Syntree.Element.prototype.isElement = function() {
    return true;
}

/**
 * Whether or not this element is deletable.
 * Deletable elements are Syntree.Node, Syntree.Branch, Syntree.Arrow.
 * Syntree.Branch should never be deletable directly by the user.
 * Branches should only be deleted automatically when their child node is deleted.
 *
 * @see Syntree.Node.__delete
 * @returns {boolean}
 */
Syntree.Element.prototype.isDeletable = function() {
    return true;
}

/**
 * Accessor function for property id.
 * @returns {number} the id of the element
 * @see Syntree.Element.id
 */
Syntree.Element.prototype.getId = function() {
    return this.id;
}

