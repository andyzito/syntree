function Branch(parent,child) {
	this.startPoint = parent.anchorPosition();
	this.endPoint = child.anchorPosition();

	this.line = snap.line(this.startPoint.x,this.startPoint.y,this.endPoint.x,this.endPoint.y);

	child.parentBranch = this;
	parent.childBranches.push(this);
	
	this.parent = parent;
	this.child = child;

	this.updateAppearance = function() {
		this.startPoint = this.parent.anchorPosition();
		this.endPoint = this.child.anchorPosition();
		
		this.line.attr({
			x1: this.startPoint.x,
			y1: this.startPoint.y,
			x2: this.endPoint.x,
			y2: this.endPoint.y,
		})
	}
}
