/**
 * @class
 * @classdesc Manages and stores [Actions]{@link Syntree.Action}
 */
Syntree.History = {
    // Actions is stored as a queue with the most recent action at the end (index length-1)
    // To outsiders, it is returned as an array with the most recent action at the front (index 0)
    actions: [],

    silent: false, //while silent, no actions can be added

    addAction: function(action) {
        action = Syntree.Lib.checkArg(action, 'action');

        if (!this.silent) {
            this.actions.push(action);
        }
    },

    popAction: function() {
        return this.actions.pop();
    },

    getLast: function() {
        return this.actions[this.actions.length-1];
    },

    getAll: function() {
        return this.actions.slice().reverse();
    },

    getAllByType: function(type) {
        type = Syntree.Lib.checkArg(type, 'string');

        var filtered = this.actions.filter(function(value) {
            return value.type === type;
        });
        return filtered.slice().reverse();
    },

    getLastOfType: function(type) {
        type = Syntree.Lib.checkArg(type, 'string');

        var actions = this.getByType(type);
        return actions[actions.length-1];
    },

    getNthOfType: function(type,n) {
        type = Syntree.Lib.checkArg(type, 'string');
        n = Syntree.Lib.checkArg(n, 'number', 0);

        var actions = this.getByType(type);
        return actions[actions.length - (n+1)]
    },

    undo: function() {
        silent: true;
        var all = this.getAll();
        for (i=0; i<all.length; i++) {
            if (typeof all[i].undo !== 'undefined') {
                this.removeAction(all[i]);
                all[i].undo();
                silent: false;
                return;
            }
        }
        silent: false;
    },

    removeAction: function(a) {
        a = Syntree.Lib.checkArg(a, 'action');

        if (typeof a === 'object') {
            this.actions.splice(this.actions.indexOf(a),1);
        }
    },

    getNodeSelects: function() {
        var res = this.getAllByType('select');
        res = res.filter(function(x) {
            return Syntree.Lib.checkType(x.selected_obj, 'node');
        });
        return res;
    },

    toString: function() {
        return "[object History]";
    }
}