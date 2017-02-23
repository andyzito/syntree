function History() {
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
    
    this.getByType = function(type) {
        var filtered = this.actions.filter(function(value) {
            return value.type === type;
        });
        return filtered;
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
}