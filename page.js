function Page(id, W) {
	this.id = id;
	this.allNodes = {};
	this.selectedNode = undefined;
	this.background = snap.rect(0,0,W.svg.width(),W.svg.height());
	this.background.attr({fill:'white',id:'background'});
	// this.background.drag();
	this.W = W;

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
	
	this.makeNode = function(x,y,t) {
		var newNode = new Node(this.W.genId(),x,y,t);
		this.allNodes[newNode.id] = newNode;
		var action = new Action('make',newNode);
		return newNode;
	}
	
	// this.spaceBetween = function(leftNode,rightNode) {
		// var leftPos = leftNode.position();
		// var rightPos = rightNode.position();
		// var leftSize = leftNode.labelSize();
		// var rightSize = rightNode.labelSize();
		
		// var leftNodeRightBound = leftPos.x + (leftSize.w/2);
		// var rightNodeLeftBound = rightPos.x - (rightSize.w/2);
		
		// return rightNodeLeftBound - leftNodeRightBound;
	// }
	
	// Events :

	this.eventNodeClick = function(clickedNode) {
		var node = this.allNodes[$(clickedNode).attr('id').split('-')[1]];
		this.selectNode(node);
	}

	this.eventEnter = function() {
		if (typeof this.selectedNode != 'undefined') {
			this.tree.spread(this.selectedNode.parent);
			this.selectedNode.editToggle();
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
				console.log(selectedIndex);
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
			if (this.selectedNode.children.length > 0) {
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
	
	// : events.
	
	this.tree = new Tree(this,undefined,this.background.attr('width')/2,20);
}