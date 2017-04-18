Syntree.Graphic = function(config_matrix) {
    this.elements = {};
    Syntree.Lib.config(config_matrix, this);

    for (name in this.elements_to_add) {
        this.addElement(name, this.elements_to_add[name]);
    }
    delete this.elements_to_add;
}

Syntree.Graphic.prototype.config_map = {
    elements_to_add: {
        type: 'object',
        default_value: {},
    },
    states_synced: {
        type: 'object',
        default_value: {},
    },
    update_map: {
        type: 'object',
        default_value: '#undefined',
    },
    data_object: {
        type: ['node', 'branch', 'arrow'],
    },
}

Syntree.Graphic.prototype.addElement = function(name, element) {
    this.elements[name] = {};
    this.elements[name].el_obj = Syntree.Lib.checkArg(element.el_obj, 'object');
    this.elements[name].attr_handler = Syntree.Lib.checkArg(element.attr_handler, 'function', this._defaultAttrHandler);
    this.elements[name].include_in_svg_string = Syntree.Lib.checkArg(element.include_in_svg_string, 'boolean', false);
}

Syntree.Graphic.prototype.getSVGString = function() {
    var s = "";
    for (name in this.elements) {
        if (this.elements[name].include_in_svg_string) {
            s += this.getEl(name).node.outerHTML;
        }
    }
    return s;
}

Syntree.Graphic.prototype._defaultAttrHandler = function(element, attrs) {
    element.attr(attrs);
}

Syntree.Graphic.prototype.getEl = function(name) {
    return this.elements[name].el_obj;
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
            var state_obj = this.update_map[state];
            if (state_obj.handler === 'boolean') {
                this._handlerBoolean(state_obj);
            } else if (Syntree.Lib.checkType(state_obj.handler, 'function')) {
                state_obj.handler(this.data_object, this);
            }
            this.states_synced[state] = true;

            // this.update_functions[state](this.data_object, this);
            // this.states_synced[state] = true;
        }
    }
    if (Syntree.Lib.checkType(this.update_map['#default'], 'function')) {
        this.update_map['#default'](this.data_object, this);
    }
}

Syntree.Graphic.prototype.delete = function() {
    for (name in this.elements) {
        if (Syntree.Lib.checkType(this.getEl(name).node, 'object')) {
            this.getEl(name).node.remove();
        } else {
            this.getEl(name).remove();
        }
    }
}

Syntree.Graphic.prototype.recreate = function() {
    for (name in this.elements) {
        $("#workspace").append(this.elements[name].node);
    }
}

Syntree.Graphic.prototype._handlerBoolean = function(state_obj) {
    var d = this.data_object;

    for (name in state_obj.elements) {
        var el = this.elements[name];
        // console.log(name);
        // console.log(el);
        var state_el_data = state_obj.elements[name];
        if (d[state_obj.state_name]) {
            el.attr_handler(el.el_obj, state_el_data.stateTrueAttrs);
        } else {
            el.attr_handler(el.el_obj, state_el_data.stateFalseAttrs);
        }
    }
}