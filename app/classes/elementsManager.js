Syntree.ElementsManager = {
	allElements: {},

	allSelectables: {},

	selectedElement: undefined,

	register: function(obj) {
		if (Syntree.Lib.checkType(obj.select, 'function')) {
			this.allSelectables[obj.getId()] = obj;
		}
		this.allElements[obj.getId()] = obj;
	},

	deregister: function(obj) {
		if (Syntree.Lib.checkType(obj.select, 'function')) {
			delete this.allSelectables[obj.getId()];
		}
		delete this.allElements[obj.getId()];
	},

	select: function(obj) {
		console.log('inside elm.select')
		if (!Syntree.Lib.checkType(this.selectedElement, 'undefined')) {
			this.deselect();
		}

		this.selectedElement = obj;
		obj.select();
	},

	deselect: function() {
		this.selectedElement.deselect();
		this.selectedElement = undefined;
	},

	isRegistered: function(obj) {
		return !Syntree.Lib.checkType(this.allElements[obj], ['undefined', 'null']);
	},

	getSelected: function() {
		return this.selectedElement;
	},

	deleteSelected: function() {
		this.selectedElement.delete();
	}
}