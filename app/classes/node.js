Syntree.Node = function(config_matrix) {
    Syntree.selectableElement.call(this); // Extends
    Syntree.Lib.config(config_matrix,this);

    // Relationships
    this.parent = undefined;
    this.children = [];

    // Branches
    this.parentBranch = undefined;
    this.childBranches = [];

    // States
    this.editing = false;
    this.real = false;

    this._labelbbox;

    this.createGraphic();
    this.updateGraphics();
}

Syntree.Node.prototype.config_map = {
    id: {
        type: 'number',
        default_value: '#undefined',
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

Syntree.Node.prototype.createGraphic = function() {
    var editorid = "editor-" + this.id;
    $("#workspace_container").append('<input id="' + editorid + '" class="editor">');
    var editor = $("#" + editorid);
    editor.hide();

    // Highlight
    var highlight = Syntree.snap.rect(this.x,this.y,0,0);
    highlight.attr({
        class: "highlight highlight-" + this.id,
    });

    // Delete button
    var deleteButton = Syntree.snap.image('/app/resources/delete_button.png',this.x,this.y,10,10);
    deleteButton.attr({
        class: 'delete_button delete_button-' + this.id,
    });

    // Label
    var label = Syntree.snap.text(this.x,this.y,this.labelContent);
    label.attr({
        'id': "label-"+this.id,
        'class':'node-label',
    });

    var config_matrix = {
        elements: {
            label: label,
            highlight: highlight,
            deleteButton: deleteButton,
            editor: editor,
        },
        states_synced: {
            selected: false,
            labelContent: false,
            position: false,
        },
        data_object: this,
        update_functions: {
            selected: function(d,g) {
                if (d.selected) {
                    g.getEl('highlight').attr({
                        fill:"rgba(0,0,0,0.2)",
                    });

                    g.getEl('deleteButton').attr({
                        opacity: 100,
                        class: "delete_button"
                    });
                } else {
                    g.getEl('highlight').attr({
                        fill:"none"
                    });

                    g.getEl('deleteButton').attr({
                        opacity: 0,
                        class: "delete_button invisible",
                    });
                }
            },
            labelContent: function(d,g) {
                if (d.labelContent.match(/\s|^$/)) {
                    g.getEl('label').node.textContent = "Oalsdnfkabsfjhbdsfj";
                    g.getEl('label').attr({
                        color: 'transparent',
                    });
                }
                g.getEl('label').node.textContent = d.labelContent;
                    // g.getEl('label').attr({
                    //     color: 'transparent',
                    // });
            },
            position: function(d,g) {
                var bbox = d.getLabelBBox();
                g.getEl('label').attr({
                    x: d.x-(bbox.w/2),
                    y: d.y+(bbox.h/2),
                });
                d._labelbbox = undefined;
                bbox = d.getLabelBBox();
                g.getEl('highlight').attr({
                    x: bbox.x - 5,
                    y: bbox.y - 5,
                    width: bbox.w + 10,
                    height: bbox.h + 10,
                });
                g.getEl('deleteButton').attr({
                    x: bbox.x2,
                    y: bbox.y - 10,
                });
                g.getEl('editor').css({
                    'left': bbox.x,// + groupXOffset,
                    'top': bbox.y,// + groupYOffset,
                    'width': bbox.w,
                    'height': bbox.h,
                });
            }
        }
    }
    this.graphic = new Syntree.Graphic(config_matrix)
}

// Syntree.Node.prototype.getId = function() {
//     return this.id;
// }

Syntree.Node.prototype.getPosition = function() {
    return {
        x: this.x,
        y: this.y
    };
}

Syntree.Node.prototype.getLabelContent = function() {
    return this.labelContent;
}

Syntree.Node.prototype.setLabelContent = function(content) {
    this.graphic.unsync('labelContent');
    this.labelContent = content;
}

Syntree.Node.prototype.getLabelBBox2 = function() {
    if (this.graphic.getEl('label').node.textContent === "" || $("#" + this.graphic.getEl('label').attr('id')).length === 0) {
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
    return this.graphic.getEl('label').getBBox();
}

Syntree.Node.prototype.getLabelBBox = function() {
    if (this.graphic.getEl('label').node.textContent === "" || $("#" + this.graphic.getEl('label').attr('id')).length === 0) {
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
            this._labelbbox = this.graphic.getEl('label').getBBox();
        }
        return this._labelbbox;
    }
}


Syntree.Node.prototype.getParent = function() {
    return this.parent;
}

Syntree.Node.prototype.getChildren = function() {
    return this.children;
}

Syntree.Node.prototype.getPath = function() {
    var bbox = this.getLabelBBox();
    var p = 10;
    var s = "M " + (bbox.x-p) + " " + (bbox.y-p) + ", ";
    s += "H " + (bbox.x2+p) + ", ";
    s += "V " + (bbox.y2+p) + ", ";
    s += "H " + (bbox.x-p) + ", ";
    s += "V " + (bbox.y-p) + ", ";
    return s;
}

Syntree.Node.prototype.getState = function(which) {
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

Syntree.Node.prototype.getSVGString = function() {
    s = this.graphic.getEl('label').node.outerHTML;
    if (Syntree.Lib.checkType(this.parentBranch, 'branch')) {
        s += this.parentBranch.line.node.outerHTML;
    }
    return s;
}

Syntree.Node.prototype.move = function(x,y,propagate) {
    this.graphic.unsync('position');
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

Syntree.Node.prototype.__delete = function() {
    if (Syntree.Lib.checkType(this.parentBranch, 'branch')) {
        this.parentBranch.delete();
    }
    if (Syntree.Lib.checkType(this.parent, 'node')) {
        this.parent.children.splice(this.parent.children.indexOf(this), 1);
    }
}

// Syntree.Node.prototype.select = function() {
//     this.selected = true;
//     this.graphic.unsync('selected');
//     this.updateGraphics(false);
// }

// Syntree.Node.prototype.deselect = function() {
//     this.selected = false;
//     this.graphic.unsync('selected');
//     this.updateGraphics(false);
// }

Syntree.Node.prototype.editingAction = function(action) {
    switch(action) {
        case 'init':
            this.editing = true;
            this.beforeEditLabelContent = this.labelContent;
            this.updateGraphics(false);
            this.graphic.getEl('editor').val(this.labelContent);
            this.graphic.getEl('editor').show();
            Syntree.Lib.focusNoScroll(this.graphic.getEl('editor'));
            break;
        case 'update':
            if (this.editing) {
                this.graphic.unsync('position');
                this._labelbbox = undefined;
                this.setLabelContent(this.graphic.getEl('editor').val());
                this.updateGraphics(false);
            }
            break;
        case 'save':
            this._labelbbox = undefined;
            if (!this.real) {
                this.real = true;
            }
            if (this.editing) {
                this.graphic.unsync('position');
                this.editing = false;
                this.setLabelContent(this.graphic.getEl('editor').val());
                this.graphic.getEl('editor').hide();
                this.graphic.getEl('editor').blur();
                this.beforeEditLabelContent = undefined;
                this._labelbbox = undefined;
                this.positionUnsynced = true;
                this.updateGraphics(false);
            }
            break;
        case 'cancel':
            if (this.editing) {
                this.graphic.unsync('position');
                this.editing = false;
                this.graphic.getEl('editor').hide();
                this.setLabelContent(this.beforeEditLabelContent);
                this.beforeEditLabelContent = undefined;
                this._labelbbox = undefined;
                this.updateGraphics(false);
            }
            break;
    }
}

Syntree.Node.prototype.__updateGraphics = function(propagate) {
    propagate = Syntree.Lib.checkArg(propagate, 'boolean', false);
    if (this.positionUnsynced) {
        propagate = true;
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

Syntree.Node.prototype.addChild = function(newNode,index) {
    newNode = Syntree.Lib.checkArg(newNode, 'node');
    index = Syntree.Lib.checkArg(index, 'number', this.children.length);
    index = Syntree.Lib.checkArg(index, 'number');

    if (!this.real) {
        return;
    }
    newNode.parent = this;

    this.children.splice(index,0,newNode);

    var branch = new Syntree.Branch(this,newNode);
}

Syntree.Node.prototype.toString = function() {
    return "[object Node]";
}
