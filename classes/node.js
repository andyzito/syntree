function Node(config_matrix) {
    this.config_map = {
        id: {
            type: 'number',
            default_value: Syntree.Lib.genId(),
        },
        x: {
            type: 'number',
            default_value: 0,
        },
        y: {
            type: 'number',
            default_value: 0,
        },
        labelContent: {
            type: 'string',
            default_value: '',
        },

    }

    Syntree.Lib.config(config_matrix,this);
    Syntree.Page.registerNode(this); // register with master list of nodes

    // Create graphical elements
    // Editor
    var editorid = "editor-" + this.id;
    $("#workspace_container").append('<input id="' + editorid + '" class="editor">');
    this.editor = $("#" + editorid);
    this.editor.hide();

    // Highlight
    this.highlight = Syntree.snap.rect(this.x,this.y,0,0);
    this.highlight.attr({class: "highlight"})

    // Delete button
    this.deleteButton = Syntree.snap.image('/app/resources/delete_button.png',this.x,this.y,10,10);
    this.deleteButton.attr({class: 'delete_button'})

    // Label
    this.label = Syntree.snap.text(this.x,this.y,this.labelContent);
    this.label.attr({'id':"label-"+this.id,'class':'node-label'});

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
    this.deleted = false;

    // Property retrieval:
    this.getId = function() {
        return this.id;
    }

    this.getPosition = function() {
        return {
            x: this.x,
            y: this.y
        };
    }

    this.getLabelContent = function() {
        return this.labelContent;
    }

    this.getLabelBBox = function() {
        if (this.label.node.textContent === "" || $("#" + this.label.attr('id')).length === 0) {
            var fakeHeight = 15;
            var fakeWidth = 10;
            return {
                x: this.x - fakeWidth/2,
                x2: this.x + fakeWidth/2,
                y: this.y - fakeHeight/2,
                y2: this.y + fakeHeight/2,
                w: fakeWidth,
                width: fakeWidth,
                height: fakeHeight,
                h: fakeHeight
            }
        }

        bbox = this.label.getBBox();
        return bbox;
    }

    this.getParent = function() {
        return this.parent;
    }

    this.getChildren = function() {
        return this.children;
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
            case 'deleted':
                return this.deleted;
                break;
            default:
                return {
                    selected: this.selected,
                    editing: this.editing,
                    real: this.real,
                    deleted: this.deleted,
                }
        }
    }

    this.getSVGString = function() {
        s = this.label.node.outerHTML;
        if (Syntree.Lib.checkType(this.parentBranch, 'branch')) {
            s += this.parentBranch.line.node.outerHTML;
        }
        return s;
    }

    this.move = function(x,y,propagate) {
        x = Syntree.Lib.checkArg(x, 'number');
        y = Syntree.Lib.checkArg(y, 'number');
        propagate = Syntree.Lib.checkArg(propagate, 'boolean', true);

        var oldX = this.x;
        var oldY = this.y;

        this.x = x;
        this.y = y;
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
        delete Syntree.Page.allNodes[this.id];
        if (Syntree.Lib.checkType(this.parentBranch, 'branch')) {
            this.parentBranch.delete();
        }
        if (Syntree.Lib.checkType(this.parent, 'node')) {
            this.parent.children.splice(this.parent.children.indexOf(this), 1);
        }
        this.deleted = true;
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
                Syntree.Lib.focusNoScroll(this.editor);
                break;
            case 'update':
                if (this.editing) {
                    this.labelContent = this.editor.val();
                    this.updateGraphics(false);
                }
                break;
            case 'save':
                if (!this.real) {
                    this.real = true;
                }
                if (this.editing) {
                    this.editing = false;
                    this.labelContent = this.editor.val();
                    this.editor.hide();
                    this.beforeEditLabelContent = undefined;
                    this.updateGraphics(false);
                }
                break;
            case 'cancel':
                if (this.editing) {
                    this.editing = false;
                    this.editor.hide();
                    this.labelContent = this.beforeEditLabelContent;
                    this.beforeEditLabelContent = undefined;
                    this.updateGraphics(false);
                }
                break;
        }
    }

    this.updateGraphics = function(propagate) {
        propagate = Syntree.Lib.checkArg(propagate, 'boolean', true);

        this.label.node.textContent = this.labelContent;

        var bbox = this.getLabelBBox();
        // if (this.positionUnsynced) {
        this.label.attr({
            x: this.x-(bbox.w/2),
            y: this.y+(bbox.h/2),
        });
        bbox = this.getLabelBBox();

        this.highlight.attr({
            x: bbox.x - 5,
            y: bbox.y - 5,
        })

        //     this.positionUnsynced = false;
        // }

        this.highlight.attr({
            width: bbox.w + 10,
            height: bbox.h + 10
        })


        this.deleteButton.attr({
            x: bbox.x2,
            y: bbox.y - 10,
        })

        // if ($(".page-group")[0].transform.animVal.length > 0) {
        //     var groupXOffset = $(".page-group")[0].transform.animVal[0].matrix.e;
        //     var groupYOffset = $(".page-group")[0].transform.animVal[0].matrix.f;
        // } else {
        //     var groupXOffset = 0;
        //     var groupYOffset = 0;
        // }

        if (this.editing) {
            this.editor.css({
                'left': bbox.x,// + groupXOffset,
                'top': bbox.y,// + groupYOffset,
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
        if (Syntree.Lib.checkType(this.parentBranch, 'branch')) {
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

    this.addChild = function(newNode,index) {
        newNode = Syntree.Lib.checkArg(newNode, 'node');
        index = Syntree.Lib.checkArg(index, 'number', this.children.length);
        index = Syntree.Lib.checkArg(index, 'number');

        if (!this.real) {
            return;
        }
        newNode.parent = this;

        this.children.splice(index,0,newNode);

        var branch = new Branch(this,newNode);
    }


    this.updateGraphics();
}

Node.prototype.toString = function() {
    return "[object Node]";
}
