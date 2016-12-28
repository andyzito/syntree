function Node(id,x,y,t) {
	// ID
	this.id = id;
	
	// Position
	this.x = x;
	this.y = y;
	
	// Textbox
	var label = snap.text(x,y,[t,]);
	label.attr({'id':"label-"+this.id,'class':'node-label'});
	this.label = $("#label-" + this.id);

	// Editor
	var editorid = "editor-" + this.id;
	$("#workspace_container").append('<input id="' + editorid + '" class="editor">');
	this.editor = $("#" + editorid);
	this.editor.hide();
	
	// Highlight
	this.highlight = snap.rect(this.label.attr('x'),this.label.attr('y'),0,0);
	this.highlight.attr({class: "highlight"})
	
	// Delete button
	this.deleteButton = snap.image('delete_button.png',x,y,10,10);
	this.deleteButton.attr({class: 'delete_button'});
	
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
	this.position = function(x,y,propogate) {
		if (typeof propogate == 'undefined') {
			propogate = true;
		}
		var oldX = this.x;
		var oldY = this.y;
		
		if (typeof x != 'undefined') {
			this.x = x;
		}
		if (typeof y != 'undefined') {
			this.y = y;
		}
		if (propogate) {
			var c = 0;
			while (c < this.children.length) {
				var deltaX = this.x - oldX;
				var deltaY = this.y - oldY;
				var thisChild = this.children[c];
				var pos = thisChild.position();
				thisChild.position(pos.x + deltaX,pos.y + deltaY);
				c++;
			}
		}
		this.positionUnsynced = true;
		return {
			x: this.x,
			y: this.y,
		}
	}	
	
	this.labelPosition = function(x,y) {
		if (typeof x == 'undefined' && typeof y == 'undefined') {
			return {
				x: Number(this.label.attr('x')),
				y: Number(this.label.attr('y')),
			}
		}
		if (typeof x != 'undefined') {
			this.label.attr('x',x);
		}
		if (typeof y != 'undefined') {
			this.label.attr('y',y);
		}
	}	
	
	this.getLabelBBox = function() {
		if (this.labelContent() === "" || $("#" + this.label.attr('id')).length === 0) {
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
		svgLabel = Snap("#" + this.label.attr('id'));
		bbox = svgLabel.getBBox();
		return bbox;
	}

	this.labelContent = function(t) {
		if (typeof t != 'undefined') {
			this.label.text(t);
		} else {
			return this.label.text();
		}
	}

	// State change:
	
	this.delete = function() {
		this.label.remove();
		this.editor.remove();
		this.highlight.remove();
		this.deleteButton.remove();
		if (typeof this.parent != 'undefined') {
			this.parentBranch.line.remove();			
			this.parent.children.splice(this.parent.children.indexOf(this), 1);
			this.parent.childBranches.splice(this.parent.childBranches.indexOf(this.parentBranch), 1);
		}
	}

	this.select = function() {
		this.selected = true;
		this.updateGraphic(false);
	}

	this.deselect = function() {
		this.selected = false;
		this.updateGraphic(false);
	}

	this.editInit = function(e) {
		this.editing = true;
		this.beforeEditLabelContent = this.labelContent();
		this.updateGraphic(false);
		this.editor.val(this.labelContent());
		this.editor.show();
		this.editor.focus();
	}
	
	this.editUpdate = function() {
		if (this.editing) {
			this.labelContent(this.editor.val());
			this.updateGraphic(false);
		}
	}
	
	this.editToggle = function() {
		if (this.editing) {
			this.save();
		} else {
			this.editInit();
		}
	}

	this.save = function(e) {
		if (!this.real) {
			this.real = true;
		}
		if (this.editing) {
			this.editing = false;
			this.labelContent(this.editor.val())
			this.editor.hide();
			this.editor.blur();
			this.updateGraphic(false);
		}
	}

	this.cancel = function() {
		this.editing = false;
		this.editor.hide();
		this.labelContent(this.beforeEditLabelContent);
		this.updateGraphic(false);
	}
	
	this.updateGraphic = function(propogate) {
		if (typeof propogate == 'undefined') {
			propogate = true;
		}
		
		var bbox = this.getLabelBBox();
		if (this.positionUnsynced) {
			this.labelPosition(this.x-(bbox.w/2), this.y+(bbox.h/2));		
			bbox = this.getLabelBBox();
			
			this.highlight.attr({
				x: bbox.x - 5,
				y: bbox.y - 5,
				width: bbox.w + 10,
				height: bbox.h + 10
			})
			
			this.positionUnsynced = false;
		} else {
			this.highlight.attr({
				width: bbox.w + 10,
				height: bbox.h + 10
			})
		}
		
		this.deleteButton.attr({
			x: bbox.x2,
			y: bbox.y - 10,
		})


		if (this.editing) {
			this.editor.css({
				'left': bbox.x,
				'top': bbox.y,
				'width': bbox.w,
				'height': bbox.h,
			});
		}

		if (this.selected) {
			this.highlight.attr({
				fill:"rgba(255,0,0,0.2)"
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
			this.parentBranch.updateGraphic();
		}
		for (i=0;i<this.childBranches.length;i++) {
			this.childBranches[i].updateGraphic();
		}
		
		if (propogate) {
			var c = 0;
			while (c < this.children.length) {
				this.children[c].updateGraphic();
				c++;
			}
		}
	}
	
	this.updateGraphic();
}
