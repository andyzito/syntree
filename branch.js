function Branch(parent,child) {
	this.startPoint = parent.position();
	this.endPoint = child.position();

	this.line = snap.line(this.startPoint.x,this.startPoint.y,this.endPoint.x,this.endPoint.y);

	child.parentBranch = this;
	parent.childBranches.push(this);
	
	this.parent = parent;
	this.child = child;

	this.updateGraphic = function(seconds) {
		if (typeof seconds == 'undefined') {
			var seconds = 0;
		}
		this.startPoint = this.parent.position();
		this.endPoint = this.child.position();
		
		if (seconds != 0) {
			this.line.animate({
				x1: this.startPoint.x,
				y1: this.startPoint.y + 15,
				x2: this.endPoint.x,
				y2: this.endPoint.y - 15,
			},seconds)
		}
		
		this.line.attr({
			x1: this.startPoint.x,
			y1: this.startPoint.y + (this.parent.labelSize().h/2) + 5,
			x2: this.endPoint.x,
			y2: this.endPoint.y - (this.child.labelSize().h/2) - 5,
		})
	}
}
