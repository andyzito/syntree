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
}