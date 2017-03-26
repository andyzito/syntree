function History() {
    // Actions is stored as a queue with the most recent action at the end (index length-1)
    // To outsiders, it is returned as an array with the most recent action at the front (index 0)
    this.actions = [];

    this.addAction = function(action) {
        this.actions.push(action);
    }

    this.popAction = function() {
        return this.actions.pop();
    }

    this.getLast = function() {
        return this.actions[this.actions.length-1];
    }

    this.getAll = function() {
        return this.actions.slice().reverse();
    }

    this.getAllByType = function(type) {
        var filtered = this.actions.filter(function(value) {
            return value.type === type;
        });
        return filtered.slice().reverse();
    }

    this.getLastOfType = function(type) {
        var actions = this.getByType(type);
        return actions[actions.length-1];
    }

    this.getNthOfType = function(type,n) {
        if (typeof n === 'undefined') {
            n = 0;
        }
        var actions = this.getByType(type);
        return actions[actions.length - (n+1)]
    }

    this.undo = function() {
        var all = this.getAll();
        for (i=0; i<all.length; i++) {
            if (typeof all[i].undo !== 'undefined') {
                this.removeAction(all[i]);
                all[i].undo();
                return;
            }
        }
    }

    this.removeAction = function(a) {
        if (typeof a === 'object') {
            this.actions.splice(this.actions.indexOf(a),1);
        }
    }
}

History.prototype.toString = function() {
    return "[object History]"
}
