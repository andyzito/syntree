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

    this._labelbbox;
    this.positionUnsynced = true;
    this.selectStateUnsynced = true;

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

    this.getLabelBBox2 = function() {
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
        return this.label.getBBox();
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
        } else {
            if (!Syntree.Lib.checkType(this._labelbbox, 'object')) {
                this._labelbbox = this.label.getBBox();
            }
            return this._labelbbox;
        }
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
        this._labelbbox = undefined;
        this.positionUnsynced = true;
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
        // this.positionUnsynced = true;
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
        this.selectStateUnsynced = true;
        this.updateGraphics(false);
    }

    this.deselect = function() {
        this.selected = false;
        this.selectStateUnsynced = true;
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
                    this._labelbbox = undefined;
                    this.labelContent = this.editor.val();
                    this.updateGraphics(false);
                }
                break;
            case 'save':
                this._labelbbox = undefined;
                if (!this.real) {
                    this.real = true;
                }
                if (this.editing) {
                    this.editing = false;
                    this.labelContent = this.editor.val();
                    this.editor.hide();
                    this.editor.blur();
                    this.beforeEditLabelContent = undefined;
                    this._labelbbox = undefined;
                    this.positionUnsynced = true;
                    this.updateGraphics(false);
                }
                break;
            case 'cancel':
                if (this.editing) {
                    this.editing = false;
                    this.editor.hide();
                    this.labelContent = this.beforeEditLabelContent;
                    this.beforeEditLabelContent = undefined;
                    this._labelbbox = undefined;
                    this.updateGraphics(false);
                }
                break;
        }
    }

    this.updateGraphics = function(propagate) {
        propagate = Syntree.Lib.checkArg(propagate, 'boolean', false);
        if (this.positionUnsynced) {
            propagate = true;
        }

        this.label.node.textContent = this.labelContent;

        var bbox = this.getLabelBBox();
        if (this.positionUnsynced) {
            this.label.attr({
                x: this.x-(bbox.w/2),
                y: this.y+(bbox.h/2),
            });
            this._labelbbox = undefined;
            bbox = this.getLabelBBox();
            this.positionUnsynced = false;
        }

        this.highlight.attr({
            x: bbox.x - 5,
            y: bbox.y - 5,
            width: bbox.w + 10,
            height: bbox.h + 10
        })


        this.deleteButton.attr({
            x: bbox.x2,
            y: bbox.y - 10,
        })

        if (this.editing) {
            this.editor.css({
                'left': bbox.x,// + groupXOffset,
                'top': bbox.y,// + groupYOffset,
                'width': bbox.w,
                'height': bbox.h,
            });
        }

        if (this.selectStateUnsynced) {
            if (this.selected) {
                this.highlight.attr({
                    fill:"rgba(0,0,0,0.2)",
                });

                this.deleteButton.attr({
                    opacity: 100,
                    class: "delete_button"
                })
            } else {
                this.highlight.attr({
                    fill:"none"
                    });

                this.deleteButton.attr({
                    opacity: 0,
                    class: "delete_button invisible",
                })
            }
            this.selectStateUnsynced = false;
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
