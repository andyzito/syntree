function Tree(x,y) {
	this.nodes = {};
	this.selected = null;
	this.idRef = 0;
	this.rowHeight = 70;
	
	this.genId = function() {
		this.idRef++;
		return this.idRef;
	}
	
	// Events :
	
	this.eventNodeClick = function(clickedNode) {
		var node = this.nodes[$(clickedNode).attr('id').split('-')[1]];
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
	
	// : events.
		
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

	this.makeNode = function(x,y,t) {
		var newNode = new Node(this.genId(),x,y,t);
		this.nodes[newNode.id] = newNode;
		return newNode;
	}

	this.makeChildOf = function(parentNode,left,text) {
		if (typeof text == 'undefined') {
			text = "";
		}
		var pos = parentNode.position();
		var size = parentNode.labelSize();

		var newChild = this.makeNode(pos.x,pos.y+this.rowHeight,text);

		newChild.parent = parentNode;

		if (left) {
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
				siblings[i].position(leftBound+(interval*i));
				siblings[i].updateAppearance(1000);
				i = i+1;
			}
		}
		
		var branch = new Branch(parentNode,newChild);
		this.editNode(newChild);
		return newChild;
	}
	
	this.getChildrenOf = function(node,inclusive) {
		var result = {};
		var len = node.children.length;
		var i = 0;

		while (i < node.children.length) {
			var thisChild = node.children[i];
			result[thisChild.id] = this.getChildrenOf(thisChild);
			i = i + 1;
		}

		if (inclusive) {
			var t = node.id;
			temp = {};
			temp[t] = result;
			result = temp;
		}

		return result;
	}
	
	this.getNodesByOffset = function(node,off) {
		// Adapted from http://stackoverflow.com/questions/13523951/how-to-check-the-depth-of-an-object Kavi Siegel's answer
		if (off == 0) {
			return node;
		}

		var result = [];
		var children = node.children;
		var c = 0;
		
		while(c < children.length) {
			if (off === 0) {
				result.push(children[c]);
			} else {
				result = result.concat(this.getNodesByOffset(children[c],off-1));
			}
			c++;
		}
		return result;
	}

	this.move = function(nodes,deltaX,s) {
		var i = 0;
		while (i < nodes.length) {
			nodes[i].move(deltaX,s);
			i++;
		}
	}
	
	this.reposition = function() {		
		var row = 0;
		var off = 1;
		var done = true;
		
		while (off < 3) {
			while (true) {
				var nodes = this.getNodesByOffset(this.root,row);
				if (nodes.length == 0) {
					break;
				}

				var n = 0;
				while (n < nodes.length-1) {
					var leftNode = nodes[n];
					var rightNode = nodes[n+1];
					
					var leftChildren = this.getNodesByOffset(leftNode,off);
					var rightChildren = this.getNodesByOffset(rightNode,off);
					if (leftChildren.length === 0 || rightChildren.length === 0) {
						n++;
						continue;
					}

					var leftBound = leftChildren[leftChildren.length-1].labelPosition().x + leftChildren[leftChildren.length-1].labelSize().w;
					var rightBound = rightChildren[0].labelPosition().x;

					var space = rightBound - leftBound;

					if (space < 50) {
						done = false;
						var diff = 50 - space;
						var m = diff/2;
						if (leftNode.parent != rightNode.parent) {
							var ancestors = this.getNearestParentSiblings(leftNode,rightNode);
							ancestors[0].move(-m,0);
							ancestors[1].move(m,0);
						} else {
							leftNode.move(-m,0);
							rightNode.move(m,0);
						}
					}
					n++;
				}
				row++;
			}
			off++;
		}
		if (!done) {
			this.reposition();
		}
	}

	// Util:
	
	this.getDepthOf = function(object) {
		// Taken from http://stackoverflow.com/questions/13523951/how-to-check-the-depth-of-an-object Kavi Siegel's answer
		var level = 1;
		var key;
		
		for(key in object) {
			if (!object.hasOwnProperty(key)) continue;

			if(typeof object[key] == 'object'){
				var depth = this.getDepthOf(object[key]) + 1;
				level = Math.max(depth, level);
			}
		}
		return level;
	}
	
	this.spaceBetween = function(leftNode,rightNode) {
		var leftPos = leftNode.labelPosition();
		var rightPos = rightNode.labelPosition();
		var leftSize = leftNode.labelSize();
		
		var leftNodeRightBound = leftPos.x + leftSize.w;
		var rightNodeLeftBound = rightPos.x;
		
		return rightNodeLeftBound - leftNodeRightBound;
	}
	
	this.getNearestParentSiblings = function(leftNode,rightNode) {
		if (leftNode.parent == rightNode.parent) {
			return [leftNode, rightNode];
		} else {
			return this.getNearestParentSiblings(leftNode.parent, rightNode.parent);
		}
	}
	
	this.root = this.makeNode(x,y,"A long piece of text");
	this.selectNode(this.root);

}