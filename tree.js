function Tree(x,y) {
	this.nodes = {};
	this.allIds = [];
	this.rowHeight = 100;
	
	this.genId = function() {
		var num = Math.floor(Math.random()*100);
		if (this.allIds.indexOf(num) >= 0) {
			this.genId();
		} else {
			this.allIds.push(num);
			return num;
		}
	}
	
	this.selectNode = function(node) {
		if (this.selected != null) {
			this.selected.deselect();
		}
		this.selected = node;
		this.selected.select();
	}
	
	this.editNode = function(node) {
		if (!node.selected) {
			this.selectNode(node);
		}
		node.edit();
	}

	this.eventNodeClick = function(clickedNode) {
		var node = this.nodes[$(clickedNode).attr('id')];
		this.selectNode(node);
	}
	
	this.eventEnter = function() {
		if (this.selected != null) {
			this.selected.editToggle();
		}
	}
	
	this.eventLeft = function() {
		if (this.selected != null) {
			if (this.selected.parent.children.length > 1) {
				var siblings = this.selected.parent.children;
				var selectedIndex = siblings.indexOf(this.selected);
				if (selectedIndex > 0) {
					this.selectNode(siblings[selectedIndex-1]);
				} else {
					this.makeChildOf(this.selected.parent,true);
				}
			} else {
				this.makeChildOf(this.selected.parent)
			}
		}
	}
	
	this.eventUp = function() {
		if (this.selected.parent != null) {
			this.selectNode(this.selected.parent);
		}
	}
	
	this.eventDown = function() {
		if (this.selected != null) {
			if (this.selected.children.length > 0) {
				this.selectNode(this.selected.children[0]);
			} else {
				this.makeChildOf(this.selected);
			}
		}
	}

	this.eventRight = function() {
		if (this.selected != null) {
			if (this.selected.parent.children.length > 1) {
				var siblings = this.selected.parent.children;
				var selectedIndex = siblings.indexOf(this.selected);
				console.log(selectedIndex);
				if (selectedIndex < siblings.length-1) {
					this.selectNode(this.selected.parent.children[selectedIndex+1]);
				} else {
					this.makeChildOf(this.selected.parent);
				}
			} else {
				this.makeChildOf(this.selected.parent);
			}
		}
	}

	this.makeNode = function(x,y,t) {
		var newNode = new Node(this.genId(),x,y,t);
		this.nodes[newNode.id] = newNode;
		return newNode;
	}

	this.makeChildOf = function(parentNode,left) {
		var pos = parentNode.anchorPosition();
		var size = parentNode.size();

		var newChild = this.makeNode(pos.x,pos.y+this.rowHeight,"");

		newChild.parent = parentNode;

		if (typeof left != 'undefined') {
			parentNode.children.unshift(newChild);
		} else {
			parentNode.children.push(newChild);
		}


		var siblings = parentNode.children;
		if (siblings.length > 1) {
			var leftBound = pos.x - (this.rowHeight * Math.tan(45 * (Math.PI / 180)));
			var rightBound = pos.x + (this.rowHeight * Math.tan(45 * (Math.PI / 180)));
			var spread = rightBound - leftBound;
			var interval = spread/(siblings.length-1);
			var i = 0;
			while (i < siblings.length) {
				siblings[i].anchorPosition(x=leftBound+(interval*i));
				i = i+1;
			}
		}
		
		var branch = new Branch(parentNode,newChild);
		
		this.editNode(newChild);
	}
	
	this.getChildrenOf = function(node,inclusive) {
		var result = {};
		var len = node.children.length;
		var i = 0;

		while (i < node.children.length) {
			var thisChild = node.children[i];
			result[thisChild.text()] = this.getChildrenOf(thisChild);
			i = i + 1;
		}

		if (inclusive) {
			var t = node.text();
			temp = {};
			temp[t] = result;
			result = temp;
		}

		return result;
	}

	this.root = this.makeNode(x,y,"A long piece of text");
	this.selectNode(this.root);
}