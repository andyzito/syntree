/**
 * @class
 * @classdesc Manages and stores [Actions]{@link Syntree.Action}
 */
Syntree.History = {
    /**
     * Actions is stored as a queue with the most recent action at the end (index length-1).
     * Note that it is returned as an array with the most recent action at the front (index 0).
     *
     * @see Syntree.History.getAll()
     */
    actions: [],

    /**
     * While this is set to true, no [Actions]{@link Syntree.Action} are added to the history.
     * This is used so that we don't have to worry about creating new [Actions]{@link Syntree.Action} while undoing old ones.
     */
    silent: false,

    /**
     * Add an action to the history.
     *
     * @see Syntree.History.actions
     */
    addAction: function(action) {
        action = Syntree.Lib.checkArg(action, 'action');

        if (!this.silent) {
            this.actions.push(action);
        }
    },

    /**
     * Get the most recent [Action]{@link Syntree.Action}.
     *
     * @see Syntree.History.actions
     * @returns {Syntree.Action} - the most recent action.
     */
    getLast: function() {
        return this.actions[this.actions.length-1];
    },

    /**
     * Get all [Actions]{@link Syntree.Action}, reversed so that the most recent is at the front.
     *
     * @returns {Syntree.Action[]} - all actions in the history.
     *
     * @see Syntree.History.actions
     */
    getAll: function() {
        return this.actions.slice().reverse();
    },

    /**
     * Get all [Actions]{@link Syntree.Action}, reversed so that the most recent is at the front.
     * Filter by given type.
     *
     * @param {string} - type of action to filter by, e.g. 'select'
     * @returns {Syntree.Action[]} - all actions matching the given type
     *
     * @see Syntree.History.getAll
     * @see Syntree.History.actions
     */
    getAllByType: function(type) {
        type = Syntree.Lib.checkArg(type, 'string');

        var filtered = this.actions.filter(function(value) {
            return value.type === type;
        });
        return filtered.slice().reverse();
    },

    /**
     * Get the most recent [Action]{@link Syntree.Action} of given type.
     *
     * @param {string} - type of action to filter by, e.g. 'select'
     * @returns {Syntree.Action} - most recent action of given type
     *
     * @see Syntree.History.getLast
     * @see Syntree.History.actions
     */
    getLastOfType: function(type) {
        type = Syntree.Lib.checkArg(type, 'string');

        var actions = this.getByType(type);
        return actions[actions.length-1];
    },

    /**
     * Undo the most recent undoable [Action]{@link Syntree.Action}.
     * During this function, History is silenced so that it does not collect eroneously produced [Actions]{@link Syntree.Action}.
     *
     * @see Syntree.History.silent
     */
    undo: function() {
        this.silent = true;
        var all = this.getAll();
        for (i=0; i<all.length; i++) {
            if (typeof all[i].undo !== 'undefined') {
                this.removeAction(all[i]);
                all[i].undo();
                this.silent = false;
                return;
            }
        }
        this.silent = false;
    },

    /**
     * Remove the given [Action]{@link Syntree.Action} from the history.
     *
     * @param {Syntree.Action} - action to remove
     *
     * @see Syntree.History.actions
     */
    removeAction: function(a) {
        a = Syntree.Lib.checkArg(a, 'action');

        this.actions.splice(this.actions.indexOf(a),1);
    },

    /**
     * Get all [Actions]{@link Syntree.Action} representing a Node selection.
     * This is a convenience function, so that we don't have to filter for selected element type inline.
     *
     * @returns {Syntree.Action[]} - all Node select actions, most recent at index 0
     *
     * @see Syntree.History.actions
     */
    getNodeSelects: function() {
        var res = this.getAllByType('select');
        res = res.filter(function(x) {
            return Syntree.Lib.checkType(x.selected_obj, 'node');
        });
        return res;
    },

    toString: function() {
        return '[object History]';
    }
}