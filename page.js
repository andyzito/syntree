function Page(W) {
	this.allNodes = {};
	this.selectedNode = null;
	this.W = W;

	this.selectNode = function(node) {
		var action = new Action('select',node);
		if (this.selectedNode != null) {
			this.deselectNode(this.selectedNode);
		}
		this.selectedNode = node;
		this.selectedNode.select();
	}

	this.deselectNode = function(node) {
		this.selectedNode = null;
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
		node.label.remove();
		node.editor.remove();
		node.anchorMark.remove();
		node.highlight.remove();
		if (node.parent != undefined) {
			node.parentBranch.line.remove();
			node.parent.children.splice(node.parent.children.indexOf(node), 1);
			node.parent.childBranches.splice(node.parent.childBranches.indexOf(node.parentBranch), 1);
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
	
	this.spaceBetween = function(leftNode,rightNode) {
		var leftPos = leftNode.position();
		var rightPos = rightNode.position();
		var leftSize = leftNode.labelSize();
		var rightSize = rightNode.labelSize();
		
		var leftNodeRightBound = leftPos.x + (leftSize.w/2);
		var rightNodeLeftBound = rightPos.x - (rightSize.w/2);
		
		return rightNodeLeftBound - leftNodeRightBound;
	}
	
	// Events :

	this.eventNodeClick = function(clickedNode) {
		var node = this.allNodes[$(clickedNode).attr('id').split('-')[1]];
		this.selectNode(node);
	}

	this.eventEnter = function() {
		if (this.selectedNode != null) {
			this.selectedNode.editToggle();
		}
	}
	
	this.eventLeft = function() {
		if (this.selectedNode != null) {
			var off = this.tree.getNodeOffset(this.tree.root,this.selectedNode);
			var rowNodes = this.tree.getNodesByOffset(this.tree.root,off);
			if (rowNodes.length > 1) {
				var selectedIndex = rowNodes.indexOf(this.selectedNode);
				if (selectedIndex > 0) {
					this.selectNode(rowNodes[selectedIndex-1]);
				} else {
					this.tree.makeChildOf(this.selectedNode.parent,true);
				}
			} else {
				this.tree.makeChildOf(this.selectedNode.parent,true)
			}
		}
	}
	
	this.eventRight = function() {
		if (this.selectedNode != null) {
			var off = this.tree.getNodeOffset(this.tree.root,this.selectedNode);
			var rowNodes = this.tree.getNodesByOffset(this.tree.root,off);
			if (rowNodes.length > 1) {
				var selectedIndex = rowNodes.indexOf(this.selectedNode);
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
		if (this.selectedNode != null) {
			if (this.selectedNode.parent != null) {
				this.selectNode(this.selectedNode.parent);
			}
		}
	}
	
	this.eventDown = function() {
		if (this.selectedNode != null) {
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
		if (this.selectedNode != null) {
			this.deleteNode(this.selectedNode);
			this.selectNode(H.getNthOfType('select',1).node);
		}
	}
	
	this.eventEsc = function() {
		if (this.selectedNode != null) {
			this.selectedNode.cancel();
		}
	}
	
	// : events.
	
	this.tree = new Tree(this,undefined,W.svg.width()/2,20);
}