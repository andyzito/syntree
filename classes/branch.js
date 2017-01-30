function Branch(parent,child) {
	this.startPoint = parent.position();
	this.endPoint = child.position();

	this.line = snap.line(this.startPoint.x,this.startPoint.y,this.endPoint.x,this.endPoint.y);

	child.parentBranch = this;
	parent.childBranches.push(this);
	
	this.parent = parent;
	this.child = child;

	this.updateGraphic = function() {
		this.startPoint = this.parent.position();
		this.endPoint = this.child.position();
				
		this.line.attr({
			x1: this.startPoint.x,
			y1: this.parent.getLabelBBox().y2 + 5,
			x2: this.endPoint.x,
			y2: this.child.getLabelBBox().y - 5,
		})
	}
}
