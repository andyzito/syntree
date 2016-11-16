function Tree(x,y) {
	this.nodes = {};
	this.allIds = [];
	this.rowHeight = 100;
	
	this.genId = function() {
		var num = Math.floor(Math.random()*1000);
		if (this.allIds.indexOf(num) >= 0) {
			this.genId();
		} else {
			this.allIds.push(num);
			return num;
		}
	}
	
	this.selectNode = function(node) {
		var action = new Action('select',node);
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
				this.makeChildOf(this.selected.parent,true)
			}
		}
	}
	
	this.eventRight = function() {
		if (this.selected != null) {
			if (this.selected.parent.children.length > 1) {
				var siblings = this.selected.parent.children;
				var selectedIndex = siblings.indexOf(this.selected);
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
	
	this.eventUp = function() {
		if (this.selected.parent != null) {
			this.selectNode(this.selected.parent);
		}
	}
	
	this.eventDown = function() {
		if (this.selected != null) {
			if (this.selected.children.length > 0) {
				var possibleSelects = this.selected.children;
				var selectHistory = H.getByType('select');
				
				for (i=selectHistory.length-1; i>=0; i--) {
					if (possibleSelects.indexOf(selectHistory[i].node) >= 0) {
						console.log(selectHistory[i].node);
						this.selectNode(selectHistory[i].node);
						return;
					}
				}
				this.selectNode(this.selected.children[0]);
			} else {
				this.makeChildOf(this.selected);
			}
		}
	}

	this.makeNode = function(x,y,t) {
		var newNode = new Node(this.genId(),x,y,t);
		this.nodes[newNode.id] = newNode;
		return newNode;
	}

	this.makeChildOf = function(parentNode,left) {
		var pos = parentNode.position();
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
			var leftBound = pos.x - (this.rowHeight * Math.tan(30 * (Math.PI / 180)));
			var rightBound = pos.x + (this.rowHeight * Math.tan(30 * (Math.PI / 180)));
			var spread = rightBound - leftBound;
			var interval = spread/(siblings.length-1);
			var i = 0;
			while (i < siblings.length) {
				siblings[i].move(leftBound+(interval*i),50);
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
	
	this.getNodesByOffset = function(tree,off) {
		if (off < 0) {
			return [];
		} else if (off == 0) {
			return Object.keys(tree)[0];
		} else {
			var result = []
			var i = 0;
			while (i <= this.depthOf(tree)) {
				var currNode = Object.keys(Object.keys(Object.keys(tree)[0]))[i];
				result.push(this.getNodesByOffset(tree[Object.keys(tree)[i]],off-i));
				i++;
			}
		}
		return result;
	}

	this.depthOf = function(object) {
		var level = 1;
		var key;
		for (key in object) {
			if (!object.hasOwnProperty(key)) continue;
			
			if (typeof object[key] == 'object') {
				var depth = this.depthOf(object[key]) + 1;
				level = Math.max(depth, level);
			}
		}
		return level;
	}

	this.root = this.makeNode(x,y,"A long piece of text");
	this.selectNode(this.root);
}