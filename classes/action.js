function Action(type, node) {
	this.type = type;
	this.node = node;
	
	H.addAction(this);
}