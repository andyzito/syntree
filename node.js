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
	this.highlight.attr({
		fill: "rgba(255,0,0,0.5)",
	});
	
	// Anchor mark
	this.anchorMark = snap.circle(this.x,this.y,3);

	// Relationships
	this.parent = null;
	this.children = [];

	// Branches
	this.parentBranch = null;
	this.childBranches = [];
		
	// States
	this.editing = false;
	this.selected = false;
	this.real = false;

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
	
	this.labelSize = function() {
		return {
			w: this.label.get()[0].getComputedTextLength(),
			h: this.label.height(),
		}
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
		this.anchorMark.remove();
		this.highlight.remove();
		this.parentBranch.line.remove();
		this.parent.children.splice(this.parent.children.indexOf(this), 1);
		this.parent.childBranches.splice(this.parent.childBranches.indexOf(this.parentBranch), 1);
	}

	this.select = function() {
		this.selected = true;
		this.updateGraphic();
	}

	this.deselect = function() {
		this.selected = false;
		this.updateGraphic();
	}

	this.editInit = function(e) {
		this.editing = true;
		this.beforeEditLabelContent = this.labelContent();
		this.updateGraphic();
		this.editor.val(this.labelContent());
		this.editor.show();
		this.editor.focus();
	}
	
	this.editUpdate = function() {
		if (this.editing) {
			this.labelContent(this.editor.val());
			this.updateGraphic();
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
			this.updateGraphic();
		}
	}

	this.cancel = function() {
		this.editing = false;
		this.editor.hide();
		this.labelContent(this.beforeEditLabelContent);
		this.updateGraphic();
	}
	
	this.updateGraphic = function(propogate) {
		if (typeof propogate == 'undefined') {
			propogate = true;
		}
		var size = this.labelSize();
		this.labelPosition(this.x-(size.w/2), this.y+(size.h/2));		
		var tpos = this.labelPosition();
		this.highlight.attr({
			x: tpos.x - 5,
			y: tpos.y - size.h - 5,
			width: size.w + 10,
			height: size.h + 10
			});
		this.anchorMark.attr({
			cx: this.x,
			cy: this.y,
			// r:3
		})
		if (this.selected) {
			this.highlight.attr({
				fill:"rgba(255,0,0,0.3)"
			});
			this.anchorMark.attr({
				fill:"rgba(255,0,0,0.5)"
			})
		} else {
			this.highlight.attr({
				fill:"none"
				});
			this.anchorMark.attr({
				fill:"none"
			})
		}
		
		this.editor.css({
			'left': this.labelPosition().x,
			'top': this.labelPosition().y - this.labelSize().h,
			'width': this.labelSize().w,
			'height': this.labelSize().h,
		});
		
		// Branches
		if (this.parentBranch != null) {
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
