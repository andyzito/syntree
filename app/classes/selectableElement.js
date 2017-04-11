Syntree.selectableElement = function() {
    this.selected = false;
    this.select = function() {
        this.selected = true;
        this.graphic.unsync('selected');
        this.updateGraphics(false);
    }
    this.deselect = function() {
        this.selected = false;
        this.graphic.unsync('selected');
        this.updateGraphics(false);
    }

	Syntree.element.call(this);
}