// Right now, elements are Node, Branch, and Arrow
Syntree.element = function() {
    if (!Syntree.Lib.checkType(this.id, 'number')) {
        this.id = Syntree.Lib.genId();
    }

    this.getId = function() {
        return this.id;
    }

    this.get = function(which) {
        return this[which];
    }

    this.deleted = false;
    this.delete = function() {
        if (this.deleted) {
            return;
        }
        if (Syntree.Lib.checkType(this.__delete, 'function')) {
            this.__delete();
        }
        this.graphic.delete();
        Syntree.ElementsManager.deregister(this);
        this.deleted = true;
    }

    this.recreate = function() {
        this.deleted = false;
        if (Syntree.Lib.checkType(this.__recreate, 'function')) {
            this.__recreate();
        }
        this.graphic.recreate();
        Syntree.ElementsManager.register(this);
    }

    this.updateGraphics = function() {
        this.graphic.update();
        if (Syntree.Lib.checkType(this.__updateGraphics, 'function')) {
            this.__updateGraphics(true);
        }
    }

    this.isSelectable = function() {
        return false;
    }

    this.isElement = function() {
        return true;
    }

    this.isDeletable = function() {
        return true;
    }

    Syntree.ElementsManager.register(this);
    this.createGraphic();
}