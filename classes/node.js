function Node(x,y,t) {
	if (typeof t === 'undefined') {
		t = "";
	}

	// ID
	this.id = requestId();
	W.page.allNodes[this.id] = this;
	
	// Position
	this.x = x;
	this.y = y;
	
	// Label
	this.label = snap.text(x,y,t);
	this.label.attr({'id':"label-"+this.id,'class':'node-label'});

	// Editor
	var editorid = "editor-" + this.id;
	$("#workspace_container").append('<input id="' + editorid + '" class="editor">');
	this.editor = $("#" + editorid);
	this.editor.hide();
	
	// Highlight
	this.highlight = snap.rect(this.label.attr('x'),this.label.attr('y'),0,0);
	this.highlight.attr({class: "highlight"})
	
	// Delete button
	this.deleteButton = snap.image('/syntree/app/resources/delete_button.png',x,y,10,10);
	this.deleteButton.attr({class: 'delete_button'})
	
	// Relationships
	this.parent = undefined;
	this.children = [];

	// Branches
	this.parentBranch = undefined;
	this.childBranches = [];
		
	// States
	this.editing = false;
	this.selected = false;
	this.real = false;
	this.positionUnsynced = true;

	// Property retrieval:
	this.getPosition = function() {
		return {x: this.x, y: this.y};
	}

	this.getState = function(which) {
		switch (which) {
			case 'selected':
				return this.selected;
				break;
			case 'editing':
				return this.editing;
				break;
			case 'real':
				return this.real;
				break;
			default:
				return {
					selected: this.selected,
					editing: this.editing,
					real: this.real
				}
		}
	}

	this.getParent = function() {
		return this.parent;
	}

	this.getChildren = function() {
		return this.children;
	}

	this.getId = function() {
		return this.id;
	}

	this.getLabelContent = function() {
		return this.label.node.textContent;
	}

	this.getLabelBBox = function() {
		if (this.label.node.textContent === "" || $("#" + this.label.attr('id')).length === 0) {
			return {
				x: this.x,
				x2: this.x,
				y: this.y,
				y2: this.y,
				w: 0,
				width: 0,
				height: 0,
				h: 0
			}
		}

		bbox = this.label.getBBox();
		return bbox;
	}


	this.move = function(x,y,propagate) {
		if (typeof propagate == 'undefined') {
			propagate = true;
		}
		var oldX = this.x;
		var oldY = this.y;
		
		if (typeof x != 'undefined') {
			this.x = x;
		}
		if (typeof y != 'undefined') {
			this.y = y;
		}
		if (propagate) {
			var c = 0;
			while (c < this.children.length) {
				var deltaX = this.x - oldX;
				var deltaY = this.y - oldY;
				var thisChild = this.children[c];
				var pos = thisChild.getPosition();
				thisChild.move(pos.x + deltaX,pos.y + deltaY);
				c++;
			}
		}
		this.positionUnsynced = true;
		return {
			x: this.x,
			y: this.y,
		}
	}	
	
	this.delete = function() {
		this.label.remove();
		this.editor.remove();
		this.highlight.remove();
		this.deleteButton.remove();
		if (typeof this.parentBranch != 'undefined') {
			this.parentBranch.delete();
		}
		if (typeof this.parent != 'undefined') {
			this.parent.children.splice(this.parent.children.indexOf(this), 1);
		}
	}

	this.select = function() {
		this.selected = true;
		this.updateGraphics(false);
	}

	this.deselect = function() {
		this.selected = false;
		this.updateGraphics(false);
	}

	this.editingAction = function(action) {
		switch(action) {
			case 'init':
				this.editing = true;
				this.beforeEditLabelContent = this.label.node.textContent;
				this.updateGraphics(false);
				this.editor.val(this.label.node.textContent);
				this.editor.show();
				this.editor.focus();
				break;
			case 'update':
				if (this.editing) {
					this.label.node.textContent = this.editor.val();
					this.updateGraphics(false);
				}
				break;
			case 'save':
				if (!this.real) {
					this.real = true;
				}
				if (this.editing) {
					this.editing = false;
					this.label.node.textContent = this.editor.val()
					this.editor.hide();
					$('#workspace').focus();
					this.updateGraphics(false);
				}
				break;
			case 'cancel':
				if (this.editing) {
					this.editing = false;
					this.editor.hide();
					this.label.node.textContent = this.beforeEditLabelContent;
					this.updateGraphics(false);
					break;
				}
		}
	}

	this.updateGraphics = function(propagate) {
		if (typeof propagate == 'undefined') {
			propagate = true;
		}
		
		var bbox = this.getLabelBBox();
		// if (this.positionUnsynced) {
		// console.log("I am at " + this.x + "," + this.y);
		this.label.attr({x: this.x-(bbox.w/2)});
		this.label.attr({y: this.y+(bbox.h/2)});
		// console.log("My label is at " + this.label.attr('x') + "," + this.label.attr('y'));
		// console.log("But my label is SUPPOSED to be at " + (this.x-(bbox.w/2)) + "," + (this.y+(bbox.h/2)));
		bbox = this.getLabelBBox();

		this.highlight.attr({
			x: bbox.x - 5,
			y: bbox.y - 5,
		})
			
		// 	this.positionUnsynced = false;
		// }

		this.highlight.attr({
			width: bbox.w + 10,
			height: bbox.h + 10
		})


		this.deleteButton.attr({
			x: bbox.x2,
			y: bbox.y - 10,
		})

		if ($(".page-group")[0].transform.animVal.length > 0) {
			var groupXOffset = $(".page-group")[0].transform.animVal[0].matrix.e;
			var groupYOffset = $(".page-group")[0].transform.animVal[0].matrix.f;
		} else {
			var groupXOffset = 0;
			var groupYOffset = 0;
		}

		if (this.editing) {
			this.editor.css({
				'left': bbox.x + groupXOffset,
				'top': bbox.y + groupYOffset,
				'width': bbox.w,
				'height': bbox.h,
			});
		}

		if (this.selected) {
			this.highlight.attr({
				fill:"rgba(0,0,0,0.2)"
			});
			
			this.deleteButton.attr({
				width: 10,
				height: 10
			})
		} else {
			this.highlight.attr({
				fill:"none"
				});
			
			this.deleteButton.attr({
				width: 0,
				height: 0,
			})
		}
				
		// Branches
		if (typeof this.parentBranch != 'undefined') {
			this.parentBranch.updateGraphics();
		}
		for (i=0;i<this.childBranches.length;i++) {
			this.childBranches[i].updateGraphics();
		}
		
		if (propagate) {
			var c = 0;
			while (c < this.children.length) {
				this.children[c].updateGraphics();
				c++;
			}
		}
	}

	this.addChild = function(newNode,index,text) {
		if (typeof text == 'undefined') {
			text = "";
		}
		if (typeof index === 'undefined') {
			index = this.children.length;
		}
		if (!this.real) {
			return;
		}
		var pos = this.getPosition();

		newNode.parent = this;

		this.children.splice(index,0,newNode);
		
		var branch = new Branch(this,newNode)
	}

	
	this.updateGraphics();
}
