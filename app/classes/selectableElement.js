Syntree.selectableElement = function() {
    Syntree.element.call(this);

    this.selected = false;
    this.select = function() {
        if (Syntree.Lib.checkType(this.__select, 'function')) {
            this.__select();
        }
        this.selected = true;
        this.graphic.unsync('selected');
        this.updateGraphics(false);
    }
    this.deselect = function() {
        if (Syntree.Lib.checkType(this.__deselect, 'function')) {
            this.__deselect();
        }
        this.selected = false;
        this.graphic.unsync('selected');
        this.updateGraphics(false);
    }

    this.isSelectable = function() {
        return true;
    }
}