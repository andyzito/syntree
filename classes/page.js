function Page() {
	this.id = requestId();
	this.allNodes = {}; // so we can always get a node by its id
	this.selectedNode = undefined; // will keep track of the selected node

	// Page background
	this.background = snap.rect(0,$("#toolbar").height(),$("#workspace").width(),$("#workspace").height());
	this.background.attr({fill:'white',id:'page-background'});

	// Make group (used for panning)
	this.group = snap.g();
	this.group.attr({id: "group-" + this.id, class: "page-group"});

	this.navigateHorizontal = function(direction,fcreate) {
		if (typeof fcreate === 'undefined') {
			fcreate = false;
		}
		
		if (typeof direction === 'undefined') {
			return;
		}

		if (direction === 'left') {
			var left = true;
			var right = false;
			var n = 0;
			// var x = 0;
			// var y = -1;
		} else if (direction === 'right') {
			var right = true;
			var left = false;
			var n = 1;
			// var y = 1;
		} else {
			return;
		}

		if (typeof this.selectedNode != 'undefined') {
			// if (this.selectedNode.getState('editing') && this.selectedNode.getState('real')) {
			// 	return;
			// }
			var off = this.tree.getNodeOffset(this.tree.getRoot(),this.selectedNode);
			var rowNodes = this.tree.getNodesByOffset(this.tree.getRoot(),off);
			var selectedIndex = rowNodes.indexOf(this.selectedNode);
			var real = this.selectedNode.getState('real');

			if (right) {
				if (selectedIndex === rowNodes.length-1 || fcreate) {
					if (real) {
						var siblingIndex = this.selectedNode.getParent().getChildren().indexOf(this.selectedNode);
						var newNode = new Node(0,0);
						this.selectedNode.getParent().addChild(newNode,siblingIndex+1);
						this.nodeSelect(newNode);
						this.nodeEditing('init');
					} else {
						return;
					}
				} else {
					this.nodeSelect(rowNodes[selectedIndex+1]);
				}
			} else {
				if (selectedIndex === 0 || fcreate) {
					if (real) {
						var siblingIndex = this.selectedNode.getParent().getChildren().indexOf(this.selectedNode);
						var newNode = new Node(0,0);
						this.selectedNode.getParent().addChild(newNode,siblingIndex);
						this.nodeSelect(newNode);
						this.nodeEditing('init');
					} else {
						return;
					}
				} else {
					this.nodeSelect(rowNodes[selectedIndex-1]);
				}
			}

		}
		var tree = new Tree(this.selectedNode.getParent());
		tree.distribute();
	}

	this.navigateUp = function() {
		if (typeof this.selectedNode != 'undefined' && typeof this.selectedNode.getParent() != 'undefined') {
			this.nodeSelect(this.selectedNode.getParent());
		}
		var tree = new Tree(this.selectedNode);
		tree.distribute();
	}

	this.navigateDown = function(fcreate) {
		if (typeof this.selectedNode != 'undefined') {
			if (this.selectedNode.getChildren().length > 0 && !fcreate) {
				var possibleSelects = this.selectedNode.getChildren();
				// var selectHistory = H.getByType('select');
				
				// for (i=selectHistory.length-1; i>=0; i--) {
				// 	if (possibleSelects.indexOf(selectHistory[i].node) >= 0) {
				// 		this.selectNode(selectHistory[i].node);
				// 		return;
				// 	}
				// }
				this.nodeSelect(this.selectedNode.getChildren()[0]);
			} else if (this.selectedNode.getState('real')) {
				var newNode = new Node(0,0,"");
				this.selectedNode.addChild(newNode);
				var tree = new Tree(this.selectedNode);
				tree.distribute();
				this.nodeSelect(newNode);
				this.nodeEditing('init');
			}
		}
	}

	this.nodeEditing = function(type,node) {
		if (typeof node === 'undefined') {
			node = this.selectedNode;
		}
		if (typeof node === 'undefined') {
			return;
		}
		var dist = false;
		if (type === 'init') {
			node.editingAction('init');
		} else if (type === 'update') {
			node.editingAction('update');
		} else if (type === 'toggle') {
			if (node.getState('editing')) {
				this.nodeEditing('save');
			} else {
				this.nodeEditing('init');
			}
		} else if (type === 'save') {
			node.editingAction('save');
			if (this.selectedNode.getParent()) {
				var tree = new Tree(this.selectedNode.getParent());
				tree.distribute();
			}
		} else if (type === 'cancel') {
			node.editingAction('cancel');
		}
	}

	this.nodeDelete = function(node) {
		// var action = new Action('delete',node);
		if (typeof node === 'undefined') {
			node = this.selectedNode;
		}
		tree = new Tree(node);
		tree.delete();
		delete this.allNodes[node.getId()];
		// this.nodeSelect(this.tree.getRoot())
		// if (node.children.length > 0) {
		// 	var children = node.children.slice(0);
		// 	var c = 0;
		// 	while (c < children.length) {
		// 		this.deleteNode(children[c]);
		// 		c++;
		// 	}
		// }
		// if (node.parent != undefined) {
		// 	this.tree.spread(node.parent);
		// 	node.parent.updateGraphics();
		// }
	}

	this.nodeSelect = function(node) {
		// var action = new Action('select',node);
		if (typeof this.selectedNode != 'undefined') {
			this.nodeDeselect(this.selectedNode);
		}
		this.selectedNode = node;
		this.selectedNode.select();
	}

	this.nodeDeselect = function(node) {
		this.selectedNode = undefined;
		node.deselect();
		if (node.getState('editing')) {
			if (node.getState('real')) {
				node.editingAction('cancel');
			} else {
				this.nodeDelete(node);
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
			var pos = node.getPosition();
			var distance = Math.sqrt(Math.pow((pos.x - x),2) + Math.pow((pos.y - y),2));
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
				deltaX: nearestNode.getPosition().x - x,
				deltaY: nearestNode.getPosition().y - y,
			}
		}
	}
	
	this.addTree = function() {
		this.tree = new Tree(undefined,this.background.attr('width')/2,$("#toolbar").height()+20);
	}

	this._enablePanning = function() {
		// We need a custom move function to implement panning limits
		var move = function(dx,dy) {
			var offleft = $("#page-background").offset().left - $("#workspace_container").offset().left;
			var offtop = $("#page-background").offset().top - $("#workspace_container").offset().top;
			if ((offleft > 100 && this.data('oldDX') < dx) || (offleft < -100 && this.data('oldDX') > dx)) {
				dx = this.data('oldDX');
			}
			if ((offtop > 100 && this.data('oldDY') < dy) || (offtop < -100 && this.data('oldDY') > dy)) {
				dy = this.data('oldDY');
			}

	        this.attr({
	                    transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
	                });
	        // This allows us to make page elements pan as well, but still make panning happen only on background click
	        W.page.group.attr({
	                    transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
	                });

	        this.data('oldDX', dx);
	        this.data('oldDY', dy);
		}

		var start = function() {
	        this.data('origTransform', this.transform().local);
		}

		this.background.drag(move,start);
	}
}