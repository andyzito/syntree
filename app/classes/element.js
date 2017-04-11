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
		this.deleted = true;
	}

	Syntree.ElementsManager.register(this);
}