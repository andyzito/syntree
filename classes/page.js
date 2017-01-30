function Page(id, W) {
	this.id = id;
	this.allNodes = {};
	this.selectedNode = undefined;
	this.background = snap.rect(0,$("#toolbar").height(),W.svg.width(),W.svg.height());
	this.background.attr({fill:'white',id:'page-background'});
	this.backdrop = snap.rect(-200,-200,W.svg.width()+100,W.svg.height()+100);
	this.backdrop.attr({opacity:0,id:"page-backdrop"});
	
	this.group = snap.g(this.backdrop, this.background);
	this.group.attr({id: "group-" + this.id, class: "page-group"});
	this.group.drag();
	this.W = W;
	
	this.makeBranch = function(parent,child) {
		var branch = new Branch(parent,child);		
		this.group.append(branch.line);
		return branch;
	}

	this.makeNode = function(x,y,t) {
		var newNode = new Node(this.W.genId(),x,y,t);
		this.allNodes[newNode.id] = newNode;
		var action = new Action('make',newNode);
		
		var tempgroup = snap.g(newNode.highlight, newNode.deleteButton, newNode.label);
		this.group.append(tempgroup);
		
		return newNode;
	}

	this.deleteNode = function(node) {
		var action = new Action('delete',node);
		delete this.allNodes[node.id];
		node.delete();
		if (node.children.length > 0) {
			var children = node.children.slice(0);
			var c = 0;
			while (c < children.length) {
				this.deleteNode(children[c]);
				c++;
			}
		}
		if (node.parent != undefined) {
			this.tree.spread(node.parent);
			node.parent.updateGraphic();
		}
		return;
	}

	this.selectNode = function(node) {
		var action = new Action('select',node);
		if (typeof this.selectedNode != 'undefined') {
			this.deselectNode(this.selectedNode);
		}
		this.selectedNode = node;
		this.selectedNode.select();
	}

	this.deselectNode = function(node) {
		this.selectedNode = undefined;
		node.deselect();
		if (node.editing) {
			if (node.real) {
				node.cancel();
			} else {
				this.deleteNode(node);
			}
		}
	}

	// Events :

	this.eventNodeClick = function(clickedNode) {
		var node = this.allNodes[$(clickedNode).attr('id').split('-')[1]];
		this.selectNode(node);
	}

	this.eventEnter = function() {
		if (typeof this.selectedNode != 'undefined') {
			this.selectedNode.editToggle();
			this.tree.spread(this.selectedNode.parent)
		}
	}
	
	this.eventLeft = function() {
		if (typeof this.selectedNode != 'undefined') {
			if (this.selectedNode.editing && this.selectedNode.real) {
				return;
			}
			var off = this.tree.getNodeOffset(this.tree.root,this.selectedNode);
			var rowNodes = this.tree.getNodesByOffset(this.tree.root,off);
			var selectedIndex = rowNodes.indexOf(this.selectedNode);
			if (rowNodes.length <= 1 || this.W.ctrl === true) {
				this.tree.makeChildOf(this.selectedNode.parent,selectedIndex)
			} else if (rowNodes.length > 1) {
				if (selectedIndex > 0) {
					this.selectNode(rowNodes[selectedIndex-1]);
				} else {
					this.tree.makeChildOf(this.selectedNode.parent,0);
				}
			}
		}
	}
	
	this.eventRight = function() {
		if (typeof this.selectedNode != 'undefined') {
			if (this.selectedNode.editing && this.selectedNode.real) {
				return;
			}
			var off = this.tree.getNodeOffset(this.tree.root,this.selectedNode);
			var rowNodes = this.tree.getNodesByOffset(this.tree.root,off);
			var selectedIndex = rowNodes.indexOf(this.selectedNode);
			if (rowNodes.length <= 1 || this.W.ctrl === true) {
				this.tree.makeChildOf(this.selectedNode.parent,selectedIndex+1);
			} else if (rowNodes.length > 1) {
				if (selectedIndex < rowNodes.length-1) {
					this.selectNode(rowNodes[selectedIndex+1]);
				} else {
					this.tree.makeChildOf(this.selectedNode.parent);
				}
			} else {
				this.tree.makeChildOf(this.selectedNode.parent);
			}
		}
	}
	
	this.eventUp = function() {
		if (typeof this.selectedNode != 'undefined') {
			if (typeof this.selectedNode.parent != 'undefined') {
				this.selectNode(this.selectedNode.parent);
			}
		}
	}
	
	this.eventDown = function() {
		if (typeof this.selectedNode != 'undefined') {
			if (this.selectedNode.children.length > 0 && this.W.ctrl === false) {
				var possibleSelects = this.selectedNode.children;
				var selectHistory = H.getByType('select');
				
				for (i=selectHistory.length-1; i>=0; i--) {
					if (possibleSelects.indexOf(selectHistory[i].node) >= 0) {
						this.selectNode(selectHistory[i].node);
						return;
					}
				}
				this.selectNode(this.selectedNode.children[0]);
			} else {
				this.tree.makeChildOf(this.selectedNode);
			}
		}
	}
	
	this.eventDel = function() {
		if (typeof this.selectedNode != 'undefined') {
			this.deleteNode(this.selectedNode);
			this.selectNode(H.getNthOfType('select',1).node);
		}
	}
	
	this.eventEsc = function() {
		if (typeof this.selectedNode != 'undefined') {
			this.selectedNode.cancel();
		}
	}
	
	this.eventEditorTyping = function() {
		this.selectedNode.editUpdate();
		// this.tree.spread(this.selectedNode.parent);
	}
	
	this.eventBGClick = function(e) {
		var x = e.pageX - this.W.svg.offset().left;
		var y = e.pageY - this.W.svg.offset().top;
		var nearest = this.getNearestNode(x,y);
		
		if (typeof nearest === 'object') {
			if (nearest.deltaY < -10) {
				if (nearest.deltaX > 0) {
					this.tree.makeChildOf(nearest.node,0);
				} else {
					this.tree.makeChildOf(nearest.node);
				}
			} else {
				var childIndex = nearest.node.parent.children.indexOf(nearest.node);
				if (nearest.deltaX > 0) {
					this.tree.makeChildOf(nearest.node.parent,childIndex);
				} else {
					this.tree.makeChildOf(nearest.node.parent,childIndex+1);
				}				
			}
		}
	}
	
	this.getNearestNode = function(x,y) {
		if (typeof(x) === 'undefined' || typeof(y) === 'undefined') {
			return;
		}
		
		var nearestNode;
		var leastDist = Number.POSITIVE_INFINITY;
		var n = 0;
		var len = Object.keys(this.allNodes).length;
		while (n < len) {
			var node = this.allNodes[Object.keys(this.allNodes)[n]];
			var pos = node.position();
			var distance = Math.sqrt((pos.x - x)**2 + (pos.y - y)**2)
			if (distance < leastDist) {
				leastDist = distance;
				nearestNode = node;
			}
			n++;
		}
		if (leastDist < this.tree.rowHeight + 10) {
			return {
				node: nearestNode,
				dist: leastDist,
				deltaX: nearestNode.position().x - x,
				deltaY: nearestNode.position().y - y,
			}
		}
	}
	
	// : events.
	
	this.tree = new Tree(this,undefined,this.background.attr('width')/2,$("#toolbar").height()+20);
}