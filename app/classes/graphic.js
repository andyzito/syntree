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
        type: ['node', 'arrow', 'branch'],
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

Syntree.Graphic.prototype.sync = function(state_name) {
    this.states_synced[state_name] = true;
}

Syntree.Graphic.prototype.update = function() {
    for (state in this.states_synced) {
        if (Syntree.Lib.checkType(this.states_synced[state], 'boolean') && !this.states_synced[state]) {
            this.update_functions[state](this.data_object, this);
            this.states_synced[state] = true;
        }
    }
    if (Syntree.Lib.checkType(this.update_functions['#default'], 'function')) {
        this.update_functions['#default'](this.data_object, this);
    }
}

Syntree.Graphic.prototype.delete = function() {
    for (name in this.elements) {
        if (this.elements[name].node) {
            this.elements[name].node.remove();
        } else {
            this.elements[name].remove();
        }
    }
}

Syntree.Graphic.prototype.recreate = function() {
    for (name in this.elements) {
        $("#workspace").append(this.elements[name].node);
    }
}