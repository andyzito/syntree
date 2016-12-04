function Page(W) {
	this.allNodes = {};
	this.selectedNode = null;
	this.W = W;

	this.selectNode = function(node) {
		var action = new Action('select',node);
		if (this.selectedNode != null) {
			this.selectedNode.deselect();
		}
		this.selectedNode = node;
		this.selectedNode.select();
	}
	
	this.makeNode = function(x,y,t) {
		var newNode = new Node(this.W.genId(),x,y,t);
		this.allNodes[newNode.id] = newNode;
		return newNode;
	}
	
	this.spaceBetween = function(leftNode,rightNode) {
		var leftPos = leftNode.position();
		var rightPos = rightNode.position();
		var leftSize = leftNode.labelSize();
		var rightSize = rightNode.labelSize();
		
		var leftNodeRightBound = leftPos.x + (leftSize.w/2);
		var rightNodeLeftBound = rightPos.x - (rightSize.w/2);
		console.log(leftNodeRightBound, rightNodeLeftBound);
		
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
			if (this.selectedNode.parent.children.length > 1) {
				var siblings = this.selectedNode.parent.children;
				var selectedIndex = siblings.indexOf(this.selectedNode);
				if (selectedIndex > 0) {
					this.selectNode(siblings[selectedIndex-1]);
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
			if (this.selectedNode.parent.children.length > 1) {
				var siblings = this.selectedNode.parent.children;
				var selectedIndex = siblings.indexOf(this.selectedNode);
				if (selectedIndex < siblings.length-1) {
					this.selectNode(this.selectedNode.parent.children[selectedIndex+1]);
				} else {
					this.tree.makeChildOf(this.selectedNode.parent);
				}
			} else {
				this.tree.makeChildOf(this.selectedNode.parent);
			}
		}
	}
	
	this.eventUp = function() {
		if (this.selectedNode.parent != null) {
			this.selectNode(this.selectedNode.parent);
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
	
	// : events.
	
	this.tree = new Tree(this,undefined,W.svg.width()/2,20);
}