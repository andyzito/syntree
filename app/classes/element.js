// Right now, elements are Node, Branch, and Arrow
Syntree.element = function() {
	this.id = Syntree.Lib.genId();

	this.getId = function() {
		return this.id;
	}

	this.get = function(which) {
		return this[which];
	}

    this.deleted = false;
	this.delete = function() {
		this.graphic.delete();
		Syntree.ElementsManager.deregister(this);
		if (Syntree.Lib.checkType(this.__delete, 'function')) {
			this.__delete();
		}
		this.deleted = true;
	}

	this.updateGraphics = function() {
		this.graphic.update();
	    if (Syntree.Lib.checkType(this.__updateGraphics, 'function')) {
	        this.__updateGraphics(true);
	    }
	}

	Syntree.ElementsManager.register(this);
	this.createGraphic();
}