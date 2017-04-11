Syntree.Graphic = function(config_matrix) {
	Syntree.Lib.config(config_matrix, this);
}

Syntree.Graphic.prototype.config_map = {
	elements: {
		type: 'object',
		default: {},
	},
	states_synced: {
		type: 'object',
		default: {},
	},
	update_functions: {
		type: 'object',
		default: '#undefined',
	},
	data_object: {
		type: ['node', 'arrow'],
	},
}

Syntree.Graphic.prototype.addElement = function(name, element) {
	this.elements[name] = element;
}

Syntree.Graphic.prototype.getEl = function(name) {
	return this.elements[name];
}

Syntree.Graphic.prototype.unsync = function(state_name) {
	this.states_synced[state_name] = false;
}

Syntree.Graphic.prototype.update = function() {
	for (state in this.states_synced) {
		if (!this.states_synced[state]) {
			this.update_functions[state](this.data_object, this);
			this.states_synced[state] = true;
		}
	}
}

Syntree.Graphic.prototype.delete = function() {
	for (name in this.elements) {
		this.elements[name].remove();
	}
}