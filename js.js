$(document).ready(function() {
    var noderef = {};

    // IDs
    var allIds = [];
    genId = function() {
        var num = Math.floor(Math.random()*100);
        if (num in allIds) {
            genId();
        }
        return num;
    }

    // Selected node
    var selected = false;

    //Editor
    var editor = $("#editor");
    editor.offset({left:0,top:0});
    editor.hide();

    // Workspace
    var workspace = $("#workspace");

    //Snap
    var snap = Snap("#workspace");

    // Row height
    var rowHeight = 100;
	
	function Workspace() {
		this.svg = $("#workspace");
		this.background = snap.rect(0,0,this.svg.width(),this.svg.height());
		this.background.attr({fill:'blue'});
	}

    function Node(x,y,t) {
        // ID
        this.id = genId();
        noderef[this.id] = this;

        // Textbox
        var textbox = snap.text(x,y,[t,]);
        textbox.attr({'id':this.id});
        this.textbox = $("#" + this.id);

        // Highlight
        this.highlight = snap.rect(this.textbox.attr('x'),this.textbox.attr('y'),0,0);
        this.highlight.attr({
            fill: "rgba(255,0,0,0.5)",
        });

        // Anchor point
        this.anchorMark = snap.circle(0,0,0);

        // States
        this.editing = false;
        this.selected = false;

        // Relationships
        this.parent = null;
        this.children = [];

        // Visual property functions
        this.size = function(w,h) {
            if (typeof w == 'undefined' && typeof h == 'undefined') {
                return {
                    w: this.textbox.get()[0].getComputedTextLength(),
                    h: this.textbox.height(),
                }
            }
        }

        this.textPosition = function(x,y) {
            if (typeof x == 'undefined' && typeof y == 'undefined') {
                return {
                    x: Number(this.textbox.attr('x')),
                    y: Number(this.textbox.attr('y')),
                }
            }
            if (typeof x != 'undefined') {
                this.textbox.attr('x',x);
            }
            if (typeof y != 'undefined') {
                this.textbox.attr('y',y);
            }
        }

        this.anchorPosition = function(x,y) {
            var size = this.size();
            if (typeof x == 'undefined' && typeof y == 'undefined') {
                return {
                    x: Number(this.textbox.attr('x')) + (size.w / 2),
                    y: Number(this.textbox.attr('y')) - (size.h / 2),
                }
            }
            if (typeof x != 'undefined') {
                this.textbox.attr('x',x);
            }
            if (typeof y != 'undefined') {
                this.textbox.attr('y',y);
            }
        }

        this.text = function(t) {
            if (typeof t != 'undefined') {
                this.textbox.text(t);
            } else {
                return this.textbox.text();
            }
        }

        this.updateAppearance = function() {
            var tpos = this.textPosition();
            var apos = this.anchorPosition();
            var size = this.size();
            this.highlight.attr({
                x: tpos.x - 5,
                y: tpos.y - size.h - 5,
                width: size.w + 10,
                height: size.h + 10
                });
            this.anchorMark.attr({
                cx: apos.x,
                cy: apos.y,
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
        }

        // State changing functions
        this.select = function() {
            if (selected != false) {
                selected.deselect();
            }
            selected = this;
            this.selected = true;
            this.updateAppearance();
        }

        this.deselect = function() {
            if (this.editing) {
                this.cancel();
            }
            selected = false;
            this.selected = false;
            this.updateAppearance();
        }

        this.edit = function(e) {
            if (!this.selected) {
                this.select();
            }
            this.editing = true;
            var pos = this.textPosition();
            var size = this.size();
            editor.css('left', pos.x);
            editor.css('top', pos.y-size.h);
            editor.val(this.textbox.text());
            if (this.text() != "") {
                editor.width(size.w);
                editor.height(size.h);
            }
            editor.show();
            editor.focus();
        }

        this.save = function(e) {
            if (!this.real) {
                this.real = true;
            }
            this.editing = false;
            selected.text(editor.val())
            editor.hide();
            this.updateAppearance();
        }

        this.cancel = function() {
            this.editing = false;
            editor.hide();
            this.updateAppearance();
        }

        this.makeChild = function() {
            var pos = this.textPosition();
            var size = this.size();
            var newchild = new Node(pos.x,pos.y + rowHeight,"");
            newchild.parent = this;
            this.children.push(newchild);
            newchild.edit();
        }

        this.getChildren = function(inclusive) {
            var result = {};
            var len = this.children.length;
			var i = 0;

            while (i < this.children.length) {
                console.log(i);

                var thisChild = this.children[i];

                result[thisChild.id] = thisChild.getChildren();
				
				i = i + 1;
            }

            // if (inclusive) {
                // var thisid = this.id;
                // result = {thisid : result};
            // }

            return result;
        }

        // Events
        this.textbox.on({
            click: this.select.bind(this),
            keydown: (function(e) {
                if (e.keyCode===13) {
                    if (this.editing) {
                        this.save().bind(this);
                    } else {
                        this.edit().bind(this);
                    }
                }
            }).bind(this),
        });
    }

    var root = new Node(workspace.width()/2,20,"A long piece of text");
    root.select();

    $(document).on('keydown', function(e) {
        if (e.keyCode === 13) {
            if (selected != false) {
                if (selected.editing) {
                    selected.save();
                } else {
                    selected.edit();
                }
            }
        } else if (e.keyCode === 40) {
            selected.makeChild();
        } else if (e.keyCode === 39) {
            selected.parent.makeChild();
        }
    });


    $("#background").on('click', function(e) {
        console.log(root.getChildren());
        var mouseX = e.pageX - $(this).offset().left;
        var mouseY = e.pageY - $(this).offset().top;
        var newnode = new Node(mouseX,mouseY,"");
        newnode.edit();
    });
});