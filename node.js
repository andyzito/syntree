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
	$("#workspace_container").append('<input id="' + editorid + '" class="editor"></input>');
	this.editor = $("#" + editorid);
	this.editor.hide();
	
	// Highlight
	this.highlight = snap.rect(this.label.attr('x'),this.label.attr('y'),0,0);
	this.highlight.attr({
		fill: "rgba(255,0,0,0.5)",
	});
	
	// Anchor mark
	this.anchorMark = snap.circle(0,0,0);
	

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
	this.position = function(x,y) {
		if (typeof x != 'undefined') {
			this.x = x;
		}
		if (typeof y != 'undefined') {
			this.y = y;
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

	this.select = function() {
		this.selected = true;
		this.updateAppearance();
	}

	this.deselect = function() {
		if (this.editing) {
			this.cancel();
		}
		this.selected = false;
		this.updateAppearance();
	}

	this.edit = function(e) {
		this.editing = true;
		var pos = this.labelPosition();
		var size = this.labelSize();
		this.editor.css('left', pos.x);
		this.editor.css('top', pos.y-size.h);
		this.editor.val(this.label.text());
		if (this.labelContent() != "") {
			this.editor.width(size.w);
			this.editor.height(size.h);
		}
		this.editor.show();
		this.editor.focus();
	}
	
	this.editToggle = function() {
		if (this.editing) {
			this.save();
		} else {
			this.edit();
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
			this.updateAppearance();
		}
	}

	this.cancel = function() {
		this.editing = false;
		this.editor.hide();
		this.updateAppearance();
	}
	
	this.move = function(deltaX,s,propagate) {
		if (typeof propagate == 'undefined') {
			propagate = true;
		}
		this.x = this.x + deltaX;
		this.updateAppearance(s);
		if (propagate) {
			var i = 0;
			while (i < this.children.length) {
				this.children[i].move(deltaX,s);
				i++;
			}
		}
	}

	this.updateAppearance = function(seconds) {
		if (typeof seconds == 'undefined') {
			var seconds = 0;
		}
		var size = this.labelSize();
		
		// Animation?
		if (seconds != 0) {
			var svgLabel = Snap("#" + this.label.attr('id'))
			
			svgLabel.animate({
				x: this.x-(size.w/2),
				y: this.y+(size.h/2)
			},seconds);
			// var tpos = this.labelPosition();
			// this.highlight.animate({
				// x: tpos.x - 5,
				// y: tpos.y - size.h - 5
			// },seconds);
			// this.anchorMark.animate({
				// cx: this.x,
				// cy: this.y
			// },seconds)
		}
		
		this.labelPosition(this.x-(size.w/2), this.y+(size.h/2))
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
			r:3
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
		
		// Branches
		if (this.parentBranch != null) {
			this.parentBranch.updateAppearance(seconds);
		}
		for (i=0;i<this.childBranches.length;i++) {
			this.childBranches[i].updateAppearance(seconds);
		}
	}

}
