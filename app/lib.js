time_function = function(f,o) {
    console.log("Timing " + f);
    var start_time = new Date().getTime();
    o[f]();
    var end_time = new Date().getTime();
    return end_time - start_time;
}

time_make_child = function(id,n) {
    Syntree.Page.nodeSelect(Syntree.Page.allNodes[id]);
    var times = [];
    var i = 0;
    while (i < n) {
        times.push(time_function('_eventDown', Syntree.Workspace));
        Syntree.Workspace._eventUp();
        i++;
    }
    var sum = times.reduce(function(a, b) { return a + b; });
    return sum / times.length;
}

window.Syntree = {}; // Single global object, append any other 'globals' to this

Syntree.Lib = {
    config: function(matrix, target) {
        for (property_name in target.config_map) {
            var required_type = target.config_map[property_name].type;
            var default_value = target.config_map[property_name].default_value;

            // console.log('doing ' + property_name);

            if (!this.checkType(matrix[property_name], required_type)) {
                // console.log(property_name + "  ---  " + default_value);
                if (this.checkType(default_value, 'undefined')) {
                    // console.log(default_value);
                    throw new Error('You must provide a value for "' + property_name + '"');
                } else {
                    if (default_value !== '#undefined') {
                        target[property_name] = default_value;
                    }
                }
            } else {
                // console.log(property_name + "  ---  " + matrix[property_name]);
                target[property_name] = matrix[property_name];
            }
        }

        if (target.accept_unmapped_config && typeof target.accept_unmapped_config === 'boolean') {
            for (property_name in matrix) {
                if (typeof target.config_map[property_name] === 'undefined') {
                    target[property_name] = matrix[property_name];
                }
            }
        }
    },

    focusNoScroll: function(elem) {
      var x = window.scrollX, y = window.scrollY;
      elem.focus();
      window.scrollTo(x, y);
    },

    allIds: [],

    idN: 1000,

    genId: function() {
        if (this.allIds.length === this.idN) {
            this.idN += 1000;
        }
        while (true) {
            var x = Math.floor(Math.random()*1000);
            if (this.allIds.indexOf(x) === -1) {
                return x;
            }
        }
    },

    typeOf: function(a) {
        // Modified from http://stackoverflow.com/questions/13926213/checking-the-types-of-function-arguments-in-javascript
        var type = ({}).toString.call(a).match(/\s(\w+)/)[1].toLowerCase();
        if (type === 'object') {
            return a.toString().match(/\s(\w+)/)[1].toLowerCase();
        } else if (type === 'number' && a !== a) {
            return 'NaN';
        } else {
            return type;
        }
    },

    checkType: function(a, required_type) {
        // console.log('Inside checkType:');
        // console.log('a is ' + a);
        // console.log('type of a is ' + this.typeOf(a));
        // console.log('required_type is ' + required_type);
        if (this.typeOf(required_type) === 'string') {
            return this.typeOf(a) === required_type;
        } else if (this.typeOf(required_type) === 'array') {
            var i = 0;
            while (i < required_type.length) {
                if (this.typeOf(a) === required_type[i]) {
                    return true;
                }
                i++;
            }
            return false;
        } else {
            throw new TypeError("Please pass checkType a type string or an array of type strings for the second argument");
        }
    },

    checkArg: function(passed, required_type, default_value) {
        if (this.checkType(passed, required_type)) {
            return passed;
        } else {
            if (!this.checkType(default_value, 'undefined')) {
                if (default_value === '#undefined') {
                    return;
                } else {
                    return default_value;
                }
            } else {
                throw new TypeError('Argument is required to be type ' + String(required_type).replace(',', ' or ') + ', was type ' + this.typeOf(passed));
            }
        }
    },
}