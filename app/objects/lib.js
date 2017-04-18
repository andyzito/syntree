test_genId = function(n) {
    var gend = [];
    for (i=0; i<=n; i++) {
        var id = Syntree.Lib.genId();
        if (gend.indexOf(id) > -1) {
            console.log('duplicate: ' + id);
        }
        gend.push(id);
    }
    console.log(gend)
}
time_function = function(f,o) {
    var start_time = new Date().getTime();
    o[f]();
    var end_time = new Date().getTime();
    return end_time - start_time;
}

time_make_child = function(id,n) {
    Syntree.ElementsManager.select(Syntree.ElementsManager.allElements[id]);
    var times = [];
    var i = 0;
    while (i < n) {
        console.log('timing');
        times.push(time_function('_eventDown', Syntree.Workspace));
        Syntree.Workspace._eventUp();
        i++;
    }
    var sum = times.reduce(function(a, b) { return a + b; });
    return sum / times.length;
}

time_make_sibling = function(id,n) {
    Syntree.ElementsManager.select(Syntree.ElementsManager.allElements[id]);
    var times = [];
    var i = 0;
    while (i < n) {
        console.log('timing');
        times.push(time_function('_eventLeft', Syntree.Workspace));
        e = {
            ctrlKey: false,
        };
        Syntree.Workspace._eventRight(e);
        i++;
    }
    var sum = times.reduce(function(a, b) { return a + b; });
    return sum / times.length;
}

/** @namespace */
Syntree = {}; // Single global object, append any other 'globals' to this

/** @class
 * @memberof Syntree
 */
Syntree.Lib = {
    /**
     * Add properties to a given object, using that object's config_map property to check types and apply defaults.
     *
     * @param {object} matrix - An object of properties to be appended to the target
     * @param {object} target - The object to be 'configured'
     */
    config: function(matrix, target) {
        for (property_name in target.config_map) {
            var required_type = target.config_map[property_name].type;
            var default_value = target.config_map[property_name].default_value;

            if (!this.checkType(matrix[property_name], required_type)) {
                if (this.checkType(default_value, 'undefined')) {
                    throw new Error('You must provide a value for "' + property_name + '"');
                } else {
                    if (default_value !== '#undefined') {
                        target[property_name] = default_value;
                    }
                }
            } else {
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

    /**
     * Just a function that allows us to focus an element without auto-scrolling to it.
     * Useful if the app is embedded in a larger page.
     *
     * @param {jQuery_Object} elem - A page element to scroll to
     */
    focusNoScroll: function(elem) {
      var x = window.scrollX, y = window.scrollY;
      elem.focus();
      window.scrollTo(x, y);
    },

    /**
     * Keeps track of ids that have been generated.
     * @see Syntree.Lib.genId
     */
    allIds: [],

    /**
     * The upper bound of random number generation for ids.
     * Increases if we get too close.
     * @see Syntree.Lib.genId
     */
    idN: 1000,

    /**
     * Generates a unique id (unique within this session).
     * @see Syntree.Lib.allIds
     * @see Syntree.Lib.idN
     * @returns {number} a session-unique id
     */
    genId: function() {
        if (this.allIds.length === this.idN/2) {
            this.idN += 1000;
        }
        while (true) {
            var x = Math.floor(Math.random()*this.idN);
            if (this.allIds.indexOf(x) === -1) {
                this.allIds.push(x)
                return x;
            }
        }
    },

    /**
     * Get the type of anything, taking into account all kinds of JS type weirdness.
     * Returns undefined for NaN and null. Returns specific object type if available, 'object' otherwise.
     * @param {} a - any value
     * @returns {string} the type of the passed value
     */
    typeOf: function(a) {
        // Modified from http://stackoverflow.com/questions/13926213/checking-the-types-of-function-arguments-in-javascript
        var type = ({}).toString.call(a).match(/\s(\w+)/)[1].toLowerCase();
        if (type === 'object') {
            var t = a.toString().match(/\s(\w+)/)[1].toLowerCase();
            if (a.toString().match(/\[\w+\s\w+\]/)) {
                return t;
            } else {
                return type;
            }
        } else if (type === 'number' && a !== a) {
            return 'NaN';
        } else {
            return type;
        }
    },

    /**
     * Check a value against any given type(s).
     * @param {} a - any value
     * @param {string|string[]} required_type - a string representing the required type, or an array of such strings
     * @returns {boolean} whether the passed value matched the required type(s)
     */
    checkType: function(a, required_type) {
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

    /**
     * Ideal for checking argument types. Checks the passed value against the required type,
     * and returns the default value instead if the check doesn't pass.
     * A default value of '#undefined' will permit the type check to fail, and return nothing.
     * Otherwise (if default_value is actually undefined), will throw an error on type check failure.
     *
     * @param {} passed - any value
     * @param {string|string[]} require - a string representing the required type, or an array of such strings
     * @param {} default_value - any value, to be returned if the type check fails
     */
    checkArg: function(passed, require, default_value) {
        if (this.checkType(require, ['string', 'array'])) {
            if (this.checkType(passed, require)) {
                return passed;
            } else {
                if (!this.checkType(default_value, 'undefined')) {
                    if (default_value === '#undefined') {
                        return;
                    } else {
                        return default_value;
                    }
                } else {
                    throw new TypeError('Argument is required to be type ' + String(require).replace(',', ' or ') + ', was type ' + this.typeOf(passed));
                }
            }
        } else if (this.checkType(require, 'function')) {
            var r = require();
            if (Syntree.Lib.checkType(r, 'boolean')) {
                if (r) {
                    return passed;
                } else {
                    if (!this.checkType(default_value, 'undefined')) {
                        if (default_value === '#undefined') {
                            return;
                        } else {
                            return default_value;
                        }
                    } else {
                        throw new TypeError('Argument is the wrong type, per ' + require);
                    }
                }
            } else {
                throw new Error("Require function must return true or false");
            }
        } else {
            throw new TypeError("Argument 'require' is required to be either a type string/array or a function");
        }
    },

    distance: function(args) {
        x1 = Syntree.Lib.checkArg(args.x1, 'number');
        x2 = Syntree.Lib.checkArg(args.x2, 'number');
        y1 = Syntree.Lib.checkArg(args.y1, 'number');
        y2 = Syntree.Lib.checkArg(args.y2, 'number');

        return Math.sqrt(Math.pow((x2 - x1),2)+Math.pow((y2 - y1),2));
    },

    capitalize: function(string) {
        return string[0].toUpperCase() + string.slice(1,string.length);
    },

    getClosestSides: function(box1, box2) {
        var sides = ['x', 'x2', 'y', 'y2'];

        var leastDistance = Number.POSITIVE_INFINITY;
        var closestSides = {
            s1: '',
            s2: '',
        }
        var i = 0;
        while (i < sides.length) {
            var side1 = box1[sides[i]];
            var ii = 0;
            while (ii < sides.length) {
                var side2 = box2[sides[ii]];

                var temp = {
                    x1: sides[i].includes('x') ? side1 : box1.cx,
                    y1: sides[i].includes('y') ? side1 : box1.cy,
                    x2: sides[ii].includes('x') ? side2 : box2.cx,
                    y2: sides[ii].includes('y') ? side2 : box2.cy,
                }

                var distance = Syntree.Lib.distance(temp);
                if (distance < leastDistance) {
                    leastDistance = distance;
                    closestSides.s1 = sides[i];
                    closestSides.s2 = sides[ii];
                }
                ii++;
            }
            i++;
        }
        return closestSides;
    },

    getMidPoint: function(x1_or_obj,y1,x2,y2) {
        if (this.checkType(x1_or_obj, 'object')) {
            x1 = Syntree.Lib.checkArg(x1_or_obj.x1, 'number');
            y1 = Syntree.Lib.checkArg(x1_or_obj.y1, 'number');
            x2 = Syntree.Lib.checkArg(x1_or_obj.x2, 'number');
            y2 = Syntree.Lib.checkArg(x1_or_obj.y2, 'number');
        } else {
            x1 = Syntree.Lib.checkArg(x1_or_obj, 'number');
            y1 = Syntree.Lib.checkArg(y1, 'number');
            x2 = Syntree.Lib.checkArg(x2, 'number');
            y2 = Syntree.Lib.checkArg(y2, 'number');
        }

        return {
            x: (x1 + x2)/2,
            y: (y1 + y2)/2,
        }
    }
}