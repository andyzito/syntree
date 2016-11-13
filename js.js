$(document).ready(function() {
    var noderef = {};

    // IDs
    // var allIds = [];

    // Selected node
    // var selected = false;

    //Editor
    // var editor = $("#editor");
    // editor.offset({left:0,top:0});
    // editor.hide();

    // Workspace
    // var workspace = $("#workspace");

    //Snap
    var snap = Snap("#workspace");

    // Row height
    // var rowHeight = 100;
	
	function Branch(parent,child) {
		this.startpoint = parent.anchorPosition();
		this.endpoint = child.anchorPosition();

		this.line = snap.line(this.startpoint.x,this.startpoint.y,this.endpoint.x,this.endpoint.y);

		child.parentBranch = this;
		parent.childBranches.push(this);
		
		this.parent = parent
		this.child = child;

		this.updateAppearance = function() {
			this.startpoint = this.parent.anchorPosition();
			this.endpoint = this.child.anchorPosition();
			
			this.line.attr({
				x1: this.startpoint.x,
				y1: this.startpoint.y,
				x2: this.endpoint.x,
				y2: this.endpoint.y,
			})
		}
	}

	function Tree(x,y) {
		this.nodes = {};
		this.allIds = [];
		this.rowHeight = 100;
		
		this.genId = function() {
			var num = Math.floor(Math.random()*100);
			if (num in this.allIds) {
				this.genId();
			} else {
				this.allIds.push(num);
				return num;
			}
		}

		this.eventNodeClick = function(clickedNode) {
			if (this.selected != null) {
				this.selected.deselect();
			}
			console.log(clickedNode);
			this.selected = this.nodes[$(clickedNode).attr('id')];
			this.selected.select();
		}
		
		this.eventEnter = function() {
			if (this.selected != null) {
				if (this.selected.editing) {
					this.selected.save();
				} else {
					this.selected.edit();
				}
			}
		}
		
		this.eventDown = function() {
			if (this.selected != null) {
				this.makeChildOf(this.selected);
			}
		}
		
		this.eventRight = function() {
			if (this.selected != null) {
				this.makeChildOf(this.selected.parent);
			}
		}
		
		this.makeChildOf = function(parentNode) {
			var pos = parentNode.anchorPosition();
            var size = parentNode.size();
			
			siblings = parentNode.children;
			if (siblings.length > 0) {
				var leftBound = pos.x - (this.rowHeight * Math.tan(45 * (Math.PI / 180)));
				var rightBound = pos.x + (this.rowHeight * Math.tan(45 * (Math.PI / 180)));
				var spread = rightBound - leftBound;
				var interval = spread/siblings.length;
				// snap.line(leftBound,pos.y+this.rowHeight,rightBound,pos.y+this.rowHeight);
				// var newx = siblings[0].anchorPosition().x;
				var i = 0;
				while (i < siblings.length) {
					siblings[i].anchorPosition(x=leftBound+(interval*i));
					i = i+1;
				}
				// siblings[0].anchorPosition(x=leftBound);
				var newchild = new Node(this.genId(),rightBound,pos.y + this.rowHeight,"");
			} else {
				var newchild = new Node(this.genId(),pos.x,pos.y + this.rowHeight,"");
			}
			
			this.nodes[newchild.id] = newchild;
            newchild.parent = parentNode;
            parentNode.children.push(newchild);
			this.selected.deselect();
			this.selected = newchild;
			
			var branch = new Branch(parentNode,newchild);
			
            newchild.select();
			newchild.edit();
		}
		
        this.getChildrenOf = function(node,inclusive) {
            var result = {};
            var len = node.children.length;
			var i = 0;

            while (i < node.children.length) {
                console.log(i);

                var thisChild = node.children[i];

                result[thisChild.text()] = this.getChildrenOf(thisChild);
				
				i = i + 1;
            }

            if (inclusive) {
                var t = node.text();
                result = {t : result};
            }

            return result;
        }

		this.root = new Node(this.genId(),x,y,"A long piece of text");
		this.nodes[this.root.id] = this.root;
		this.selected = this.root;
		this.root.select();
	}
	
	function Workspace() {
		this.svg = $("#workspace");
		this.background = snap.rect(0,0,this.svg.width(),this.svg.height());
		this.background.attr({fill:'white',id:'background'});
		this.tree = new Tree(this.svg.width()/2,20);
		
		var tree = this.tree;
		
		$(document).on('click', '.node-label', function(){
			tree.eventNodeClick(this);
        });
		
		$(document).on('keydown', function(e) {
			if (e.keyCode === 13) {
				tree.eventEnter();
			} else if (e.keyCode === 40) {
				tree.eventDown();
			} else if (e.keyCode === 39) {
				tree.eventRight();
			}
		})
	}

    function Node(id,x,y,t) {
        // ID
        this.id = id;
		
        // Textbox
        var label = snap.text(x,y,[t,]);
        label.attr({'id':this.id,'class':'node-label'});
        this.label = $("#" + this.id);
		
		// Editor
		var editorid = "editor-" + this.id;
		$("#workspace_container").append('<input id="' + editorid + '" class="editor"></input>');
		this.editor = $("#" + editorid);
		// this.editor.offset({left:0,top:0});
		this.editor.hide();

		this.parentBranch = null;
		this.childBranches = [];
		
        // Highlight
        this.highlight = snap.rect(this.label.attr('x'),this.label.attr('y'),0,0);
        this.highlight.attr({
            fill: "rgba(255,0,0,0.5)",
        });

        // Anchor point
        this.anchorMark = snap.circle(0,0,0);
		this.x = x;
		this.y = y;

        // States
        this.editing = false;
        this.selected = false;
		this.real = false;

        // Relationships
        this.parent = null;
        this.children = [];

        // Visual property functions
        this.size = function(w,h) {
            if (typeof w == 'undefined' && typeof h == 'undefined') {
                return {
                    w: this.label.get()[0].getComputedTextLength(),
                    h: this.label.height(),
                }
            }
        }

        this.textPosition = function(x,y) {
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

        this.anchorPosition = function(x,y) {
            var size = this.size();
            if (typeof x == 'undefined' && typeof y == 'undefined') {
                return {
					x: this.x,
					y: this.y,
                }
            }
            if (typeof x != 'undefined') {
                this.x = x;
            }
            if (typeof y != 'undefined') {
                this.y = y;
            }
			this.updateAppearance();
        }

        this.text = function(t) {
            if (typeof t != 'undefined') {
                this.label.text(t);
            } else {
                return this.label.text();
            }
        }

        this.updateAppearance = function() {
            var size = this.size();
			this.textPosition(this.x-(size.w/2),this.y+(size.h/2));
            var tpos = this.textPosition();
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
			if (this.parentBranch != null) {
				this.parentBranch.updateAppearance();
			}
			for (i=0;i<this.childBranches.length;i++) {
				this.childBranches[i].updateAppearance();
			}
        }

        // State changing functions
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
            var pos = this.textPosition();
            var size = this.size();
            this.editor.css('left', pos.x);
            this.editor.css('top', pos.y-size.h);
            this.editor.val(this.label.text());
            if (this.text() != "") {
                this.editor.width(size.w);
                this.editor.height(size.h);
            }
            this.editor.show();
            this.editor.focus();
        }

        this.save = function(e) {
            if (!this.real) {
                this.real = true;
            }
            this.editing = false;
            this.text(this.editor.val())
            this.editor.hide();
            this.updateAppearance();
        }

        this.cancel = function() {
            this.editing = false;
            this.editor.hide();
            this.updateAppearance();
        }
    }

	var W = new Workspace();

    $("#background").on('click', function(e) {
		// alert('clicked!');
        console.log(W.tree.getChildrenOf(W.tree.root,true));
        // var mouseX = e.pageX - $(this).offset().left;
        // var mouseY = e.pageY - $(this).offset().top;
        // var newnode = new Node(mouseX,mouseY,"");
        // newnode.edit();
    });
});