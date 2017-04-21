/**
 * @class
 * @classdesc Acts as an intermediate controller between [Workspace]{@link Syntree.Workspace} and elements of the tree.
 */
Syntree.Page = function() {

    /**
     * The <rect> which is the background of the page.
     */
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

    this.allElements = {};
    this.selectedElement = undefined;
}

Syntree.Page.prototype.register = function(element) {
    element = Syntree.Lib.checkArg(element, element.isElement);
    this.allElements[element.getId()] = element;
}

Syntree.Page.prototype.deregister = function(element) {
    element = Syntree.Lib.checkArg(element, element.isElement);
    delete this.allElements[element.getId()];
}

Syntree.Page.prototype.select = function(element) {
    element = Syntree.Lib.checkArg(element, element.isSelectable);

    if (!Syntree.Lib.checkType(this.selectedElement, 'undefined')) {
        this.deselect();
    }

    this.selectedElement = element;
    element.select();

    new Syntree.Action('select', {
        selected_obj: element,
    });
}

Syntree.Page.prototype.deselect = function() {
    if (Syntree.Lib.checkType(this.selectedElement, this.selectedElement.isSelectable)) {
        this.selectedElement.deselect();
        this.selectedElement = undefined;
    }
}

Syntree.Page.prototype.deleteTree = function(tree) {
    tree = Syntree.Lib.checkArg(tree, ['tree', 'node']);
    if (Syntree.Lib.checkType(tree, 'node')) {
        tree = new Syntree.Tree({
            root: this.allElements[tree.id],
        });
    }

    var treestring = tree.getTreeString();
    var parent = tree.root.getParent();
    var index = parent.getChildren().indexOf(tree.root);
    tree.delete();
    if (Syntree.Lib.checkType(parent, 'node')) {
        temptree = new Syntree.Tree({
            root:parent
        });
        temptree.distribute();
    }
    new Syntree.Action('delete', {
        deleted_obj: tree,
        treestring: treestring,
        parent: parent,
        index: index,
    });
}

Syntree.Page.prototype.isRegistered = function(element) {
    element = Syntree.Lib.checkArg(element, element.isElement);
    return !Syntree.Lib.checkType(this.allElements[element.getId()], 'undefined');
}

Syntree.Page.prototype.getSelected = function() {
    return this.selectedElement;
}

Syntree.Page.prototype.getElementsByType = function(type) {
    type = Syntree.Lib.checkArg(type,'string');

    var res = {};
    for (id in this.allElements) {
        if (Syntree.Lib.checkType(this.allElements[id], type)) {
            res[id] = this.allElements[id];
        }
    }
    return res;
}

/**
 * Create a movement arrow from the selected [Node]{@link Syntree.Node} to the clicked [Node]{@link Syntree.Node}.
 *
 * @param {Syntree.Node} node - the node that was clicked
 */
Syntree.Page.prototype.createMovementArrow = function(node) {
    if (Syntree.Lib.checkType(this.getSelected(), 'node')) {
        var a = new Syntree.Arrow({
            fromNode: this.getSelected(),
            toNode: node,
        });
        return a;
    }
}

/**
 * Add a tree to the page.
 * If you do not provide a parent [Node]{@link Syntree.Node}, the main tree will be replaced.
 *
 * @param {Syntree.Tree} tree - the Tree object to add.
 * @param {Syntree.Node} [parent] - the Node to which the root of the Tree will be added
 * @param {number} [index] - the index at which to add the root of Tree
 */
Syntree.Page.prototype.addTree = function(tree,parent,index) {
    tree = Syntree.Lib.checkArg(tree, 'tree', '#undefined');
    parent = Syntree.Lib.checkArg(parent, 'node', '#undefined');
    index = Syntree.Lib.checkArg(index, 'number', 0);

    if (!Syntree.Lib.checkType(tree, 'tree')) {
        // Default tree
        var root = new Syntree.Node({
            x: $("#workspace").width()/2,
            y: $("#toolbar").height()+20,
            labelContent: "S",
        });
        this.tree = new Syntree.Tree({
            // build_treestring: "id:612|children:40,266|parent:undefined|labelContent:S|;id:40|children:undefined|parent:612|labelContent:Q|;id:266|children:460,170|parent:612|labelContent:Q|;id:460|children:911,884|parent:266|labelContent:Qlsfdksdfasdf|;id:911|children:undefined|parent:460|labelContent:Q|;id:884|children:undefined|parent:460|labelContent:Q|;id:170|children:undefined|parent:266|labelContent:Q|;",
            build_treestring: "id:47|children:336,250|parent:undefined|labelContent:S|;id:336|children:570,175|parent:47|labelContent:Q|;id:570|children:838,146|parent:336|labelContent:O|;id:838|children:126,716|parent:570|labelContent:C|;id:126|children:538|parent:838|labelContent:E|;id:538|children:undefined|parent:126|labelContent:B|;id:716|children:undefined|parent:838|labelContent:X|;id:146|children:911,337|parent:570|labelContent:V|;id:911|children:undefined|parent:146|labelContent:G|;id:337|children:undefined|parent:146|labelContent:H|;id:175|children:883,866|parent:336|labelContent:A|;id:883|children:956,748|parent:175|labelContent:R|;id:956|children:undefined|parent:883|labelContent:S|;id:748|children:undefined|parent:883|labelContent:U|;id:866|children:391,578|parent:175|labelContent:T|;id:391|children:undefined|parent:866|labelContent:K|;id:578|children:undefined|parent:866|labelContent:N|;id:250|children:8,863|parent:47|labelContent:Z|;id:8|children:483,514|parent:250|labelContent:x|;id:483|children:109,271|parent:8|labelContent:Z|;id:109|children:undefined|parent:483|labelContent:Y|;id:271|children:undefined|parent:483|labelContent:I|;id:514|children:378,168|parent:8|labelContent:P|;id:378|children:undefined|parent:514|labelContent:B|;id:168|children:undefined|parent:514|labelContent:V|;id:863|children:564,746|parent:250|labelContent:L|;id:564|children:300,349|parent:863|labelContent:K|;id:300|children:undefined|parent:564|labelContent:J|;id:349|children:undefined|parent:564|labelContent:F|;id:746|children:766,805|parent:863|labelContent:M|;id:766|children:undefined|parent:746|labelContent:W|;id:805|children:undefined|parent:746|labelContent:Q|;",
            // build_treestring: "id:432|children:67,741|parent:undefined|labelContent:S|;id:67|children:undefined|parent:432|labelContent:Q|;id:741|children:578|parent:432|labelContent:Q|;id:578|children:737|parent:741|labelContent:Q|;id:737|children:0|parent:578|labelContent:Q|;id:0|children:61|parent:737|labelContent:Q|;id:61|children:134|parent:0|labelContent:Q|;id:134|children:undefined|parent:61|labelContent:[OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO]|;",
            // root: root,
        });
        this.tree.root.editingAction('save');
    } else {
        // parent = this.allElements[parent.id];
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

/**
 * Create a [Tree]{@link Syntree.Tree} from a treestring, and then add it to the page.
 * If you do not provide a parent [Node]{@link Syntree.Node}, the main tree will be replaced.
 *
 * @param {Syntree.Tree} treestring - the treestring which the Tree will build from
 * @param {Syntree.Node} [parent] - the Node to which the root of the Tree will be added
 * @param {number} [index] - the index at which to add the root of Tree
 */
Syntree.Page.prototype.openTree = function(treestring,parent,index) {
    treestring = Syntree.Lib.checkArg(treestring, 'string');
    parent = Syntree.Lib.checkArg(parent, 'node', '#undefined');
    index = Syntree.Lib.checkArg(index, 'number', 0);

    var newTree = new Syntree.Tree({
        build_treestring: treestring,
    });
    this.addTree(newTree,parent,index);
}

/**
 * Get a string of SVG markup representing all marked objects on the page.
 *
 * @returns {string}
 */
Syntree.Page.prototype.getSVGString = function(offsetX,offsetY) {
    var selected = this.getSelected();
    this.deselect();
    var bgsvg = this.background.node.outerHTML;
    // var treesvg = this.tree.getSVGString(offsetX,offsetY);
    var elementssvg = "";
    var elements = this.allElements;
    for (id in elements) {
        elementssvg += elements[id].graphic.getSVGString();
    }
    var style = '<style type="text/css">text{font-family:sans-serif;font-size:14px;}</style>';
    var marker = $('marker')[0].outerHTML;
    // console.log(marker);
    this.select(selected);
    return style+marker+bgsvg+elementssvg;
    // return style+treesvg;
}

Syntree.Page.prototype.getNearestNode = function(a,b,condition) {
    condition = Syntree.Lib.checkArg(condition, 'function', function(){return true});

    if (Syntree.Lib.checkType(a, 'number')) {
        var x = a;
        var y = Syntree.Lib.checkType(b, 'number');
    } else {
        a = Syntree.Lib.checkArg(a, a.isElement);
        var x = a.getPosition().x;
        var y = a.getPosition().y;
        var ignoreNode = a;
    }

    var allNodes = this.getElementsByType('node');
    var nearestNode;
    var leastDist = Number.POSITIVE_INFINITY;
    for (id in allNodes) {
        var node = allNodes[id];
        if (ignoreNode && node === ignoreNode) {
            continue;
        }
        var pos = node.getPosition();
        // var distance = Math.sqrt(Math.pow((pos.x - x),2) + Math.pow((pos.y - y),2));
        var distance = Syntree.Lib.distance({
            x1: pos.x,
            y1: pos.y,
            x2: x,
            y2: y,
        })
        if (distance < leastDist && condition(x,y,node)) {
            leastDist = distance;
            nearestNode = node;
        }
    }
    if (Syntree.Lib.checkType(nearestNode, 'node')) {
        return {
            node: nearestNode,
            dist: leastDist,
            deltaX: x - nearestNode.getPosition().x,
            deltaY: y - nearestNode.getPosition().y,
        }
    } else {
        return false;
    }
}

Syntree.Page.prototype.navigateHorizontal = function(direction,fcreate) {
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

    if (!Syntree.Lib.checkType(this.getSelected(), 'node')) {
        this.select(this.tree.root);
    }

    if (Syntree.Lib.checkType(this.getSelected(), 'node') && Syntree.Lib.checkType(this.getSelected().getParent(), 'node')) {
        // if (this.getSelected().getState('editing') && this.getSelected().getState('real')) {
        //     return;
        // }
        var off = this.tree.getNodeOffset(this.tree.getRoot(),this.getSelected());
        var rowNodes = this.tree.getNodesByOffset(this.tree.getRoot(),off);
        var selectedIndex = rowNodes.indexOf(this.getSelected());
        var real = this.getSelected().getState('real');

        if (right) {
            if (selectedIndex === rowNodes.length-1 || fcreate) {
                if (real) {
                    var siblingIndex = this.getSelected().getParent().getChildren().indexOf(this.getSelected());
                    var newNode = new Syntree.Node({});
                    this.getSelected().getParent().addChild(newNode,siblingIndex+1);
                    var tree = new Syntree.Tree({root:this.getSelected().getParent()});
                    tree.distribute();
                    this.select(newNode);
                    this.nodeEditing('init');
                } else {
                    return;
                }
            } else {
                this.select(rowNodes[selectedIndex+1]);
            }
        } else {
            if (selectedIndex === 0 || fcreate) {
                if (real) {
                    var siblingIndex = this.getSelected().getParent().getChildren().indexOf(this.getSelected());
                    var newNode = new Syntree.Node({});
                    this.getSelected().getParent().addChild(newNode,siblingIndex);
                    var tree = new Syntree.Tree({root:this.getSelected().getParent()});
                    tree.distribute();
                    this.select(newNode);
                    this.nodeEditing('init');
                } else {
                    return;
                }
            } else {
                this.select(rowNodes[selectedIndex-1]);
            }
        }

    }
}

Syntree.Page.prototype.navigateUp = function() {
    if (!Syntree.Lib.checkType(this.getSelected(), 'node')) {
        this.select(this.tree.root);
    }

    if (Syntree.Lib.checkType(this.getSelected(), 'node') && Syntree.Lib.checkType(this.getSelected().getParent(), 'node')) {
        this.select(this.getSelected().getParent());
    }
}

Syntree.Page.prototype.navigateDown = function(fcreate) {
    fcreate = Syntree.Lib.checkArg(fcreate, 'boolean', false);

    if (!Syntree.Lib.checkType(this.getSelected(), 'node')) {
        this.select(this.tree.root);
    }

    if (Syntree.Lib.checkType(this.getSelected(), 'node')) {
        if (this.getSelected().getChildren().length > 0 && !fcreate) {
            var possibleSelects = this.getSelected().getChildren();
            var selectHistory = Syntree.History.getNodeSelects();
            for (i=0; i<selectHistory.length; i++) {
                if (possibleSelects.indexOf(selectHistory[i].selected_obj) >= 0) {
                    this.select(this.allElements[selectHistory[i].selected_obj.id]);
                    return;
                }
            }
            this.select(this.getSelected().getChildren()[0]);
        } else if (this.getSelected().getState('real')) {
            var newNode = new Syntree.Node({
                x:0,
                y:0,
                labelContent:""});
            this.getSelected().addChild(newNode);
            var tree = new Syntree.Tree({root:this.getSelected()});
            tree.distribute();
            this.select(newNode);
            this.nodeEditing('init');
        }
    }
}

Syntree.Page.prototype.nodeEditing = function(type,node, silent) {
    type = Syntree.Lib.checkArg(type, 'string');
    node = Syntree.Lib.checkArg(node, 'node', this.getSelected());
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
                new Syntree.Action('save', {
                    node: node,
                    pre: pre,
                    post: post
                });
            }
        } else {
            if (!silent) {
                new Syntree.Action('create', {
                    created_obj: node,
                });
            }
        }
        node.editingAction('save');
        if (this.getSelected().getParent()) {
            var tree = new Syntree.Tree({root:this.getSelected().getParent()});
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
Syntree.Page.prototype.toString = function() {
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