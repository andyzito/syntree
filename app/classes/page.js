Syntree.page_constructor = function() {
    Syntree.Page = this;

    // Page background
    this.background = Syntree.snap.rect(
        -100,
        -100,
        $("#workspace").width()+200,
        $("#workspace").height()+200
    );
    this.background.attr({
        fill:'white',
        id:'page-background'}
    );

    // Make group (used for panning)
    // this.group = snap.g();
    // this.group.attr({id: "group-" + this.id, class: "page-group"});
}

Syntree.page_constructor.prototype.startMovementArrow = function(node) {
    console.log('start arrow');
    this.drawingMovementArrow = true;
    this.movementArrowStartNode = node;
}

Syntree.page_constructor.prototype.endMovementArrow = function(node) {
    new Syntree.Arrow(this.movementArrowStartNode,node);
    this.drawingMovementArrow = false;
    this.movementArrowStartNode = undefined;
    console.log('end arrow');
}

// Syntree.page_constructor.prototype.register = function(element) {
//     element = Syntree.Lib.checkArg(element, ['node', 'arrow']);
//     if (Syntree.Lib.checkType(element, 'node')) {
//         this.allNodes[element.id] = element;
//     } else if (Syntree.Lib.checkType(element, 'arrow')) {
//         this.allArrows[element.id] = element;
//     }
// }

Syntree.page_constructor.prototype.addTree = function(tree,parent,index) {
    if (!Syntree.Lib.checkType(tree, 'tree')) {
        // Default tree
        var root = new Syntree.Node({
            x: $("#workspace").width()/2,
            y: $("#toolbar").height()+20,
            labelContent: "S",
        });
        this.tree = new Syntree.Tree({
            // build_treestring: "id:612|children:40,266|parent:undefined|labelContent:S|;id:40|children:undefined|parent:612|labelContent:Q|;id:266|children:460,170|parent:612|labelContent:Q|;id:460|children:911,884|parent:266|labelContent:Qlsfdksdfasdf|;id:911|children:undefined|parent:460|labelContent:Q|;id:884|children:undefined|parent:460|labelContent:Q|;id:170|children:undefined|parent:266|labelContent:Q|;",
            // build_treestring: "id:47|children:336,250|parent:undefined|labelContent:S|;id:336|children:570,175|parent:47|labelContent:Q|;id:570|children:838,146|parent:336|labelContent:O|;id:838|children:126,716|parent:570|labelContent:C|;id:126|children:538|parent:838|labelContent:E|;id:538|children:undefined|parent:126|labelContent:B|;id:716|children:undefined|parent:838|labelContent:X|;id:146|children:911,337|parent:570|labelContent:V|;id:911|children:undefined|parent:146|labelContent:G|;id:337|children:undefined|parent:146|labelContent:H|;id:175|children:883,866|parent:336|labelContent:A|;id:883|children:956,748|parent:175|labelContent:R|;id:956|children:undefined|parent:883|labelContent:S|;id:748|children:undefined|parent:883|labelContent:U|;id:866|children:391,578|parent:175|labelContent:T|;id:391|children:undefined|parent:866|labelContent:K|;id:578|children:undefined|parent:866|labelContent:N|;id:250|children:8,863|parent:47|labelContent:Z|;id:8|children:483,514|parent:250|labelContent:x|;id:483|children:109,271|parent:8|labelContent:Z|;id:109|children:undefined|parent:483|labelContent:Y|;id:271|children:undefined|parent:483|labelContent:I|;id:514|children:378,168|parent:8|labelContent:P|;id:378|children:undefined|parent:514|labelContent:B|;id:168|children:undefined|parent:514|labelContent:V|;id:863|children:564,746|parent:250|labelContent:L|;id:564|children:300,349|parent:863|labelContent:K|;id:300|children:undefined|parent:564|labelContent:J|;id:349|children:undefined|parent:564|labelContent:F|;id:746|children:766,805|parent:863|labelContent:M|;id:766|children:undefined|parent:746|labelContent:W|;id:805|children:undefined|parent:746|labelContent:Q|;",
            root: root,
        });
        root.editingAction('save');
    } else {
        if (!Syntree.Lib.checkType(parent, 'node')) {
            this.tree.delete();
            this.tree = tree;
            tree.distribute();
        } else {
            index = Syntree.Lib.checkArg(index, 'number', 0);
            parent.addChild(tree.root,index);
            var temp = new Syntree.Tree({root:parent});
            temp.distribute();
        }
    }
}

Syntree.page_constructor.prototype.openTree = function(treestring,parent,index) {
    treestring = Syntree.Lib.checkArg(treestring, 'string');
    parent = Syntree.Lib.checkArg(parent, 'node', '#undefined');
    index = Syntree.Lib.checkArg(index, 'number', 0);
    // nodes = Syntree.Lib.checkArg(nodes, 'array', '#undefined');

    var newTree = new Syntree.Tree({
        build_treestring: treestring,
    });
    // newTree.buildFromTreestring(treestring);
    this.addTree(newTree,parent,index);
}

// Syntree.page_constructor.prototype.getSelectedNode = function() {
//     return Syntree.ElementsManager.getSelected();
// }

Syntree.page_constructor.prototype.getSVGString = function() {
    if (!Syntree.ElementsManager.getSelected().getState('real')) {
        this.nodeDelete(Syntree.ElementsManager.getSelected());
    }
    var bgsvg = this.background.node.outerHTML;
    var treesvg = this.tree.getSVGString();
    var style = '<style type="text/css">text{font-family:sans-serif}</style>';
    return style+bgsvg+treesvg;
}

Syntree.page_constructor.prototype.getNearestNode = function(x,y) {
    x = Syntree.Lib.checkArg(x, 'number');
    y = Syntree.Lib.checkArg(y, 'number');

    var nearestNode;
    var leastDist = Number.POSITIVE_INFINITY;
    for (id in this.allNodes) {
        var node = this.allNodes[id];
        var pos = node.getPosition();
        var distance = Math.sqrt(Math.pow((pos.x - x),2) + Math.pow((pos.y - y),2));
        if (distance < leastDist) {
            leastDist = distance;
            nearestNode = node;
        }
        n++;
    }
    if (leastDist < this.tree.rowHeight + 10) {
        return {
            node: nearestNode,
            dist: leastDist,
            deltaX: nearestNode.getPosition().x - x,
            deltaY: nearestNode.getPosition().y - y,
        }
    }
}

Syntree.page_constructor.prototype.navigateHorizontal = function(direction,fcreate) {
    direct = Syntree.Lib.checkArg(direction, 'string');
    fcreate = Syntree.Lib.checkArg(fcreate, 'boolean', false);

    if (direction === 'left') {
        var left = true;
        var right = false;
        var n = 0;
        // var x = 0;
        // var y = -1;
    } else if (direction === 'right') {
        var right = true;
        var left = false;
        var n = 1;
        // var y = 1;
    } else {
        return;
    }

    if (Syntree.Lib.checkType(Syntree.ElementsManager.getSelected(), 'node') && Syntree.Lib.checkType(Syntree.ElementsManager.getSelected().getParent(), 'node')) {
        // if (Syntree.ElementsManager.getSelected().getState('editing') && Syntree.ElementsManager.getSelected().getState('real')) {
        //     return;
        // }
        var off = this.tree.getNodeOffset(this.tree.getRoot(),Syntree.ElementsManager.getSelected());
        var rowNodes = this.tree.getNodesByOffset(this.tree.getRoot(),off);
        var selectedIndex = rowNodes.indexOf(Syntree.ElementsManager.getSelected());
        var real = Syntree.ElementsManager.getSelected().getState('real');

        if (right) {
            if (selectedIndex === rowNodes.length-1 || fcreate) {
                if (real) {
                    var siblingIndex = Syntree.ElementsManager.getSelected().getParent().getChildren().indexOf(Syntree.ElementsManager.getSelected());
                    var newNode = new Syntree.Node({});
                    Syntree.ElementsManager.getSelected().getParent().addChild(newNode,siblingIndex+1);
                    var tree = new Syntree.Tree({root:Syntree.ElementsManager.getSelected().getParent()});
                    tree.distribute();
                    this.nodeSelect(newNode);
                    this.nodeEditing('init');
                } else {
                    return;
                }
            } else {
                this.nodeSelect(rowNodes[selectedIndex+1]);
            }
        } else {
            if (selectedIndex === 0 || fcreate) {
                if (real) {
                    var siblingIndex = Syntree.ElementsManager.getSelected().getParent().getChildren().indexOf(Syntree.ElementsManager.getSelected());
                    var newNode = new Syntree.Node({});
                    Syntree.ElementsManager.getSelected().getParent().addChild(newNode,siblingIndex);
                    var tree = new Syntree.Tree({root:Syntree.ElementsManager.getSelected().getParent()});
                    tree.distribute();
                    this.nodeSelect(newNode);
                    this.nodeEditing('init');
                } else {
                    return;
                }
            } else {
                this.nodeSelect(rowNodes[selectedIndex-1]);
            }
        }

    }
}

Syntree.page_constructor.prototype.navigateUp = function() {
    if (Syntree.Lib.checkType(Syntree.ElementsManager.getSelected(), 'node') && Syntree.Lib.checkType(Syntree.ElementsManager.getSelected().getParent(), 'node')) {
        this.nodeSelect(Syntree.ElementsManager.getSelected().getParent());
    }
}

Syntree.page_constructor.prototype.navigateDown = function(fcreate) {
    fcreate = Syntree.Lib.checkArg(fcreate, 'boolean', false);

    if (Syntree.Lib.checkType(Syntree.ElementsManager.getSelected(), 'node')) {
        if (Syntree.ElementsManager.getSelected().getChildren().length > 0 && !fcreate) {
            var possibleSelects = Syntree.ElementsManager.getSelected().getChildren().map(function(c){return c.id});
            var selectHistory = Syntree.History.getAllByType('select');
            for (i=0; i<selectHistory.length; i++) {
                if (possibleSelects.indexOf(selectHistory[i].node.id) >= 0) {
                    this.nodeSelect(Syntree.ElementsManager.allElements[selectHistory[i].node.id]);
                    return;
                }
            }
            this.nodeSelect(Syntree.ElementsManager.getSelected().getChildren()[0]);
        } else if (Syntree.ElementsManager.getSelected().getState('real')) {
            var newNode = new Syntree.Node({
                x:0,
                y:0,
                labelContent:""});
            Syntree.ElementsManager.getSelected().addChild(newNode);
            var tree = new Syntree.Tree({root:Syntree.ElementsManager.getSelected()});
            tree.distribute();
            this.nodeSelect(newNode);
            this.nodeEditing('init');
        }
    }
}

Syntree.page_constructor.prototype.nodeEditing = function(type,node, silent) {
    type = Syntree.Lib.checkArg(type, 'string');
    node = Syntree.Lib.checkArg(node, 'node', Syntree.ElementsManager.getSelected());
    node = Syntree.Lib.checkArg(node, 'node');
    silent = Syntree.Lib.checkArg(silent, 'boolean', false);

    if (type === 'init') {
        node.editingAction('init');
    } else if (type === 'update') {
        node.editingAction('update');
    } else if (type === 'toggle') {
        if (node.getState('editing')) {
            this.nodeEditing('save');
        } else {
            this.nodeEditing('init');
        }
    } else if (type === 'save') {
        if (node.getState('real')) {
            var pre = node.beforeEditLabelContent;
            var post = node.getLabelContent();
            if (!silent) {
                new ActionSave(node,pre,post);
            }
        } else {
            if (!silent) {
                new ActionCreate(node);
            }
        }
        node.editingAction('save');
        if (Syntree.ElementsManager.getSelected().getParent()) {
            var tree = new Syntree.Tree({root:Syntree.ElementsManager.getSelected().getParent()});
            tree.distribute();
        }
    } else if (type === 'cancel') {
        if (node.getState('editing')) {
            node.editingAction('cancel');
            if (!node.getState('real')) {
                this.nodeDelete(node);
            }
        }
    }
}

Syntree.page_constructor.prototype.nodeDelete = function(node, silent) {
    node = Syntree.Lib.checkArg(node, 'node', Syntree.ElementsManager.getSelected());
    node = Syntree.Lib.checkArg(node, 'node');
    silent = Syntree.Lib.checkArg(silent, 'boolean', false);

    if (node.getState('deleted')) {
        return;
    }

    var parent = node.getParent();
    var tree = new Syntree.Tree({
        root:node
    });
    if (!silent) {
        new ActionDelete(
            tree,
            parent,
            parent.getChildren().indexOf(tree.root)
        );
    }
    tree.delete();
    if (Syntree.Lib.checkType(parent, 'node')) {
        tree = new Syntree.Tree({
            root:parent
        });
        tree.distribute();
    }
    if (Syntree.Lib.checkType(Syntree.ElementsManager.getSelected(), 'node')) {
        // this.nodeSelect(this.tree.getRoot());
    }
}

Syntree.page_constructor.prototype.nodeSelect = function(node, silent) {
    node = Syntree.Lib.checkArg(node, 'node');
    silent = Syntree.Lib.checkArg(silent, 'boolean', false);

    var nodeToDeselect = Syntree.ElementsManager.getSelected();
    Syntree.ElementsManager.select(node);
    this.nodeDeselect(nodeToDeselect);
    // if (Syntree.Lib.checkType(Syntree.ElementsManager.getSelected(), 'node')) {
    //     this.nodeDeselect(Syntree.ElementsManager.getSelected());
    // }
    // Syntree.ElementsManager.getSelected() = node;
    // Syntree.ElementsManager.getSelected().select();
    if (!silent) {
        new ActionSelect(node);
    }
}

Syntree.page_constructor.prototype.nodeDeselect = function(node) {
    node = Syntree.Lib.checkArg(node, 'node', '#undefined');

    if (Syntree.Lib.checkType(node, 'node')) {
        if (node.getState('real')) {
            this.nodeEditing('cancel',node);
        } else {
            this.nodeDelete(node, true);
        }
    }
}

Syntree.page_constructor.prototype.toString = function() {
    return "[object Page]"
}
    // this._enablePanning = function() {
    //     // We need a custom move function to implement panning limits
    //     var move = function(dx,dy) {
    //         var offleft = $("#page-background").offset().left - $("#workspace_container").offset().left;
    //         var offtop = $("#page-background").offset().top - $("#workspace_container").offset().top;
    //         if ((offleft > 100 && this.data('oldDX') < dx) || (offleft < -100 && this.data('oldDX') > dx)) {
    //             dx = this.data('oldDX');
    //         }
    //         if ((offtop > 100 && this.data('oldDY') < dy) || (offtop < -100 && this.data('oldDY') > dy)) {
    //             dy = this.data('oldDY');
    //         }

    //         this.attr({
    //                     transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
    //                 });
    //         // This allows us to make page elements pan as well, but still make panning happen only on background click
    //         W.page.group.attr({
    //                     transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
    //                 });

    //         this.data('oldDX', dx);
    //         this.data('oldDY', dy);
    //     }

    //     var start = function() {
    //         this.data('origTransform', this.transform().local);
    //     }

    //     this.background.drag(move,start);
    // }