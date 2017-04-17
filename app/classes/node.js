Syntree.Node = function(config_matrix) {
    Syntree.Lib.config(config_matrix,this);
    Syntree.selectableElement.call(this); // Extends

    this.lastSyncedPosition = undefined;

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
    var deleteButton = Syntree.snap.image('/resources/delete_button.png',this.x,this.y,10,10);
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
        elements_to_add: {
            label: {
                el_obj: label,
                include_in_svg_string: true,
            },
            highlight: {
                el_obj: highlight,
            },
            deleteButton: {
                el_obj: deleteButton,
            },
            editor: {
                el_obj: editor,
                attr_handler: function(el,attrs) {
                    el.css(attrs);
                }
            },
        },
        states_synced: {
            selected: false,
            labelContent: false,
            position: false,
        },
        data_object: this,
        update_map: {
            selected: {
                handler: 'boolean',
                state_name: 'selected',
                elements: {
                    highlight: {
                        stateTrueAttrs: {
                            fill: "rgba(0,0,0,0.2)",
                        },
                        stateFalseAttrs: {
                            fill: "none",
                        },
                    },
                    deleteButton: {
                        stateTrueAttrs: {
                            width: 10,
                        },
                        stateFalseAttrs: {
                            width: 0,
                        },
                    },
                },
            },
            labelContent: {
                handler: function(d,g) {
                    if (d.labelContent === '') {
                        g.getEl('label').node.textContent = "   ";
                    } else {
                        g.getEl('label').node.textContent = d.labelContent;
                    }
                    var bbox = d.getLabelBBox();
                    g.getEl('highlight').attr({
                        width: bbox.w + 10,
                        height: bbox.h + 10,
                    });
                    g.getEl('editor').css({
                        'width': bbox.w,
                        'height': bbox.h,
                    });
                }
            },
            position: {
                handler: function(d,g) {
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
                    });
                    g.getEl('deleteButton').attr({
                        x: bbox.x2,
                        y: bbox.y - 10,
                    });
                    g.getEl('editor').css({
                        'left': bbox.x,// + groupXOffset,
                        'top': bbox.y,// + groupYOffset,
                    });
                    d.lastSyncedPosition = {
                        x: d.getPosition().x,
                        y: d.getPosition().y
                    };
                }
            }
        }
    }

    var customDrag = function(dx, dy, posx, posy) {
        if (Syntree.Workspace.rightClick) {
            return false;
        }
        var id = this.attr('id');
        id = id.substr(id.lastIndexOf('-')+1, id.length);
        var node = Syntree.ElementsManager.allElements[id];
        node.move(posx, posy);

        nearestNode = Syntree.Page.getNearestNode(node,undefined,function(x,y,n) {
            return y > n.getPosition().y;
        });
        if (nearestNode.dist < 100 && nearestNode.node.getChildren().indexOf(node) < 0 && nearestNode.deltaY > 10) {
            if (node.parent !== undefined) {
                var parent = node.parent;
                parent.detachChild(node);
                var tree = new Syntree.Tree({
                    root: parent,
                });
                tree.distribute();
            }
            nearestNode.node.addChild(node);
            var tree = new Syntree.Tree({
                root: nearestNode.node,
            });
            // tree.distribute();
        } else if (node.parent !== undefined) {
            var parent = node.parent;
            var ppos = parent.getPosition();
            var distance = Syntree.Lib.distance({
                x1: ppos.x,
                y1: ppos.y,
                x2: posx,
                y2: posy,
            })
            if (distance > 70 || ppos.y > posy) {
                parent.detachChild(node);
                var tree = new Syntree.Tree({
                    root: parent,
                });
                tree.distribute();
            }
        }

        nearestNode.node.updateGraphics();
        node.updateGraphics(true);
    }

    var customStart = function() {
        if (Syntree.Workspace.rightClick) {
            return false;
        }
    }

    var customEnd = function(dx,dy,posx,posy) {
        if (dx < 2 && dy < 2) {
            return;
        }
        var id = this.attr('id');
        id = id.substr(id.lastIndexOf('-')+1, id.length);
        var node = Syntree.ElementsManager.allElements[id];

        var parent = node.parent;
        if (parent) {
            var tree = new Syntree.Tree({
                root: parent,
            });
            tree.distribute(undefined,true);
        }
    }

    label.drag(customDrag,customStart,customEnd);

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

Syntree.Node.prototype.getSVGString = function(offsetX,offsetY) {
    offsetX = Syntree.Lib.checkArg(offsetX, 'number', 0);
    offsety = Syntree.Lib.checkArg(offsetY, 'number', 0);

    var label = this.graphic.getEl('label').node.outerHTML;
    label = $(label).attr('x', Number($(label).attr('x')) + offsetX);
    s = label[0].outerHTML;
    if (Syntree.Lib.checkType(this.parentBranch, 'branch')) {
        if (!this.parentBranch.triangle) {
            s += this.parentBranch.graphic.getEl('line').node.outerHTML;
        } else {
            s += this.parentBranch.graphic.getEl('triangle').node.outerHTML;
        }
    }
    if (Syntree.Lib.checkType(this.fromArrow, 'arrow')) {
        var arrow = this.fromArrow.graphic.getEl('line').node.outerHTML;
        arrow = $(arrow).attr('marker-end','');
        console.log(arrow[0].outerHTML)
        s += arrow[0].outerHTML;
    }
    // console.log(s);
    return s;
}

Syntree.Node.prototype.move = function(x,y,propagate) {
    x = Syntree.Lib.checkArg(x, 'number');
    y = Syntree.Lib.checkArg(y, 'number');
    propagate = Syntree.Lib.checkArg(propagate, 'boolean', true);

    var oldX = this.x;
    var oldY = this.y;

    this.x = x;
    this.y = y;

    if (this.lastSyncedPosition.x != x || this.lastSyncedPosition.y != y) {
        this.graphic.unsync('position');
        if (Syntree.Lib.checkType(this.parentBranch, 'branch')) {
            this.parentBranch.graphic.unsync('childPosition');
        }
        if (this.childBranches.length > 0) {
            this.childBranches.map(function(b) {
                b.graphic.unsync('parentPosition');
            })
        }
    } else {
        this.graphic.sync('position');
        if (Syntree.Lib.checkType(this.parentBranch, 'branch')) {
            // this.parentBranch.graphic.sync('childPosition');
        }
        if (this.childBranches.length > 0) {
            this.childBranches.map(function(b) {
                // b.graphic.sync('parentPosition');
            })
        }
    }

    this._labelbbox = undefined;
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
    return {
        x: this.x,
        y: this.y,
    }
}

Syntree.Node.prototype.__delete = function() {
    this.real = false;
    if (Syntree.Lib.checkType(this.parentBranch, 'branch')) {
        this.parentBranch.delete();
    }
    if (Syntree.Lib.checkType(this.fromArrow, 'arrow')) {
        this.fromArrow.delete();
    }
    if (Syntree.Lib.checkType(this.toArrow, 'arrow')) {
        this.toArrow.delete();
    }
    if (Syntree.Lib.checkType(this.parent, 'node')) {
        this.parent.children.splice(this.parent.children.indexOf(this), 1);
        var tree = new Syntree.Tree({
            root: this.parent,
        })
        tree.distribute();
    }
}

// Syntree.Node.prototype.__select = function() {
//     // var nodeToDeselect = Syntree.ElementsManager.getSelected();
//     // Syntree.ElementsManager.select(node);
//     // this.nodeDeselect(nodeToDeselect);

//     // if (!silent) {
//     //     new Syntree.ActionSelect(node);
//     // }
// }

Syntree.Node.prototype.__deselect = function() {
    this.editingAction('cancel');
    if (!this.real) {
        this.delete();
    }
}

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
    if (Syntree.Lib.checkType(this.fromArrow, 'arrow')) {
        this.fromArrow.updateGraphics();
    }
    if (Syntree.Lib.checkType(this.toArrow, 'arrow')) {
        this.toArrow.updateGraphics();
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

Syntree.Node.prototype.detachChild = function(node) {
    var childIndex = this.children.indexOf(node);
    var child = this.children[childIndex];
    child.parentBranch.delete();
    child.parent = undefined;
    this.children.splice(childIndex, 1);
}

Syntree.Node.prototype.toString = function() {
    return "[object Node]";
}
