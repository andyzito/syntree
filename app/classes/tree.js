Syntree.Tree = function(config_matrix) {
    this.config_map = {
        id: {
            type: 'number',
            default_value: '#undefined',
        },
        rowHeight: {
            type: 'number',
            default_value: 70,
        },
        root: {
            type: 'node',
            default_value: '#undefined',
        },
        build_treestring: {
            type: 'string',
            default_value: '#undefined',
        },
    }

    Syntree.Lib.config(config_matrix,this);

    if (!Syntree.Lib.checkType(this.build_treestring, 'string') && !Syntree.Lib.checkType(this.root, 'node')) {
        throw new Error ('You must provide a root node or a treestring when making a new Tree instance');
    }

    if (Syntree.Lib.checkType(this.build_treestring, 'string')) {
        this._buildFromTreestring(this.build_treestring);
    }

    this.node_properties_to_save = {
        id: function(n) {
            return n.getId();
        },
        children: function(n) {
            if (n.getChildren().length > 0) {
                return n.getChildren().map(function(c){
                    return c.getId()
                });
            }
        },
        parent: function(n) {
            if (Syntree.Lib.checkType(n.getParent(), 'node')) {
                return n.getParent().getId();
            }
        },
        labelContent: function(n) {
            return n.getLabelContent();
        },
    };
}

Syntree.Tree.prototype.getCenter = function() {
    // return this.root.
}

Syntree.Tree.prototype.getId = function() {
    return this.id;
}

Syntree.Tree.prototype.setId = function(id) {
    id = Syntree.Lib.checkArg(id, 'number');

    this.id = id;
}

Syntree.Tree.prototype.getRoot = function() {
    return this.root;
}

Syntree.Tree.prototype._getPath = function(which) {
    which = Syntree.Lib.checkArg(which, 'string', '#undefined');

    var toReturn = {};

    if (Syntree.Lib.checkType(which, 'undefined')) {
        var Left = true;
        var Right = true;
    } else {
        var Left = (which === 'left');
        var Right = (which === 'right');
    }

    var rootBBox = this.root.getLabelBBox();
    var rootPos = this.root.getPosition();
    var Y = rootPos.y - (rootBBox.h/2);
    toReturn.topBound = Y;
    toReturn.bottomBound = Y + rootBBox.h;

    if (Right) {
        var rX = rootPos.x - (rootBBox.w/2);
        var rPathString = "M" + rX + "," + Y;
        rPathString += "H" + (rootPos.x + (rootBBox.w/2));
        var rX = rootPos.x + (rootBBox.w/2);
        var rBound = rX;
    }

    if (Left) {
        var lX = rootPos.x + (rootBBox.w/2);
        var lPathString = "M" + lX + "," + Y;
        lPathString += "H" + (rootPos.x - (rootBBox.w/2));
        var lX = rootPos.x - (rootBBox.w/2);
        var lBound = lX;
    }

    var lastNodes;

    var row = 1;
    while (true) {
        var rowNodes = this.getNodesByOffset(this.root,row);
        if (rowNodes.length === 0) {
            lastNodes = this.getNodesByOffset(this.root,row-1);
            break;
        }

        if (Right) {
            var rNode = rowNodes[rowNodes.length-1];
            var rPos = rNode.getPosition();
            var rBBox = rNode.getLabelBBox();
            var newRX = rPos.x + (rBBox.w/2);

            if (newRX < rX) {
                rPathString += "V" + (rPos.y - (rBBox.h/2));
                rPathString += "H" + (rPos.x + (rBBox.w/2));
            } else {
                rPathString += "H" + (rPos.x + (rBBox.w/2));
                rPathString += "V" + (rPos.y - (rBBox.h/2));
            }

            rX = newRX;
            if (rX > rBound) {
                rBound = rX;
            }
            var rBotBound = (rPos.y + (rBBox.h/2));
        }

        if (Left) {
            var lNode = rowNodes[0];
            var lPos = lNode.getPosition();
            var lBBox = lNode.getLabelBBox();
            var newLX = lPos.x - (lBBox.w/2);

            if (newLX > lX) {
                lPathString += "V" + (lPos.y - (lBBox.h/2));
                lPathString += "H" + (lPos.x - (lBBox.w/2));
            } else {
                lPathString += "H" + (lPos.x - (lBBox.w/2));
                lPathString += "V" + (lPos.y - (lBBox.h/2));
            }

            lX = newLX;
            if (lX < lBound) {
                lBound = lX;
            }
            var lBotBound = (lPos.y + (lBBox.h/2));
        }
        toReturn.bottomBound = Math.max(rBotBound, lBotBound);
        row++;
    }

    var lNode = lastNodes[0];
    var rNode = lastNodes[lastNodes.length-1];
    var lPos = lNode.getPosition();
    var rPos = rNode.getPosition();
    var lBBox = lNode.getLabelBBox();
    var rBBox = rNode.getLabelBBox();

    if (Right) {
        rPathString += "V" + (rPos.y + (rBBox.h/2));
        rPathString += "H" + (lPos.x - (lBBox.w/2));
    }
    if (Left) {
        lPathString += "V" + (lPos.y + (lBBox.h/2));
        lPathString += "H" + (rPos.x + (rBBox.w/2));
    }

    if (Left && Right) {
        toReturn.pathString = lPathString + rPathString;
        toReturn.rightBound = rBound;
        toReturn.leftBound = lBound;
    } else if (Right) {
        toReturn.pathString = rPathString;
        toReturn.rightBound = rBound;
    } else if (Left) {
        toReturn.pathString = lPathString;
        toReturn.rightBound = rBound;
    }

    // this.path = snap.path(toReturn.pathString);
    // this.path.attr({stroke:'black',width:1})
    return toReturn;
}

Syntree.Tree.prototype.getDescendantsOf = function(node,attr,inclusive,flat) {
    node = Syntree.Lib.checkArg(node, 'node', this.root);
    node = Syntree.Lib.checkArg(node, 'node');
    attr = Syntree.Lib.checkArg(attr, 'string', '');
    inclusive = Syntree.Lib.checkArg(inclusive, 'boolean', true);
    flat = Syntree.Lib.checkArg(flat, 'boolean', false);

    var getAttr;
    switch (attr) {
        case 'id':
            getAttr = ".getId()";
            break;
        case 'labelContent':
            getAttr = ".getLabelContent()";
            break;
        case 'editing':
        case 'selected':
        case 'real':
            getAttr = ".getState('" + attr + "')";
            break;
        case 'x':
        case 'y':
            getAttr = ".getPosition()." + attr;
            break;
        default:
            getAttr = "";
    }

    var result = [];
    var len = node.getChildren().length;
    var i = 0;

    while (i < len) {
        var thisChild = node.getChildren()[i];
        if (!flat) {
            var toAdd = {};
            toAdd[eval("thisChild"+getAttr)] = this.getDescendantsOf(thisChild,attr,false);
            result.push(toAdd);
        } else {
            var toAdd = [eval("thisChild"+getAttr)];
            toAdd = toAdd.concat(this.getDescendantsOf(thisChild,attr,false,true));
            result = result.concat(toAdd);
        }
        i = i + 1;
    }

    if (inclusive) {
        if(!flat) {
            var t = eval("node"+getAttr);
            temp = {};
            temp[t] = result;
            result = [temp];
        } else {
            result.unshift(eval("node"+getAttr));
        }
    }

    return result;
}

Syntree.Tree.prototype.getNodeOffset = function(fromNode,toNode) {
    fromNode = Syntree.Lib.checkArg(fromNode, 'node');
    toNode = Syntree.Lib.checkArg(toNode, 'node');

    if (fromNode === toNode) {
        return 0;
    }

    var currNode = toNode;
    var off = 1;
    while (true) {
        var parent = currNode.getParent();
        if (parent === fromNode) {
            break;
        } else if (parent === 'undefined') {
            return NaN;
        } else {
            off++;
            currNode = parent;
        }
    }
    return off;
}

Syntree.Tree.prototype.getNodesByOffset = function(node,off) {
    // Adapted from http://stackoverflow.com/questions/13523951/how-to-check-the-depth-of-an-object Kavi Siegel's answer
    node = Syntree.Lib.checkArg(node, 'node');
    off = Syntree.Lib.checkArg(off, 'number');

    if (off == 0) {
        return [node];
    }

    var result = [];
    var children = node.getChildren();
    var c = 0;

    while(c < children.length) {
        if (off === 0) {
            result.push(children[c]);
        } else {
            result = result.concat(this.getNodesByOffset(children[c],off-1));
        }
        c++;
    }
    return result;
}

Syntree.Tree.prototype.getTreeString = function() {
    var s = "";
    var nodes = this.getDescendantsOf(this.root,'',true,true);
    var i = 0;
    while (i < nodes.length) {
        var node = nodes[i];
        for (p in this.node_properties_to_save) {
            s += p;
            s += ":";
            s += this.node_properties_to_save[p](node);
            s += "|";
        }
        s += ';';
        i++;
    }
    return s;
}

Syntree.Tree.prototype.getBracketNotation = function(node) {
    node = Syntree.Lib.checkArg(node, 'node', this.root);
    node = Syntree.Lib.checkArg(node, 'node');

    var string = "[." + node.getLabelContent();
    var children = node.getChildren();
    if (children.length > 0) {
        var c = 0;
        while (c < children.length) {
            var thisChild = children[c];
            var add = this.getBracketNotation(thisChild);
            string += " " + add;
            c++;
        }
    }
    string += " ]";
    return string;
}

Syntree.Tree.prototype.getSVGString = function() {
    var s = "";
    var nodes = this.getDescendantsOf(this.root,'',true,true);
    var i = 0;
    while (i<nodes.length) {
        s += nodes[i].getSVGString();
        i++;
    }
    return s;
}

Syntree.Tree.prototype.getLeftMostNode = function() {
    var node = this.root;
    while (true) {
        if (node.getChildren().length === 0) {
            return node;
        } else {
            node = node.getChildren()[0];
        }
    }
}

Syntree.Tree.prototype.getRightMostNode = function() {
    var node = this.root;
    while (true) {
        if (node.getChildren().length === 0) {
            return node;
        } else {
            node = node.getChildren()[node.getChildren().length-1];
        }
    }
}

Syntree.Tree.prototype.distribute = function(angle) {
    angle = Syntree.Lib.checkArg(angle, 'number', 60);

    var children = this.root.getChildren();
    if (children.length === 0) {
        return;
    } else if (children.length === 1){
        children[0].move(
            this.root.getPosition().x,
            this.root.getPosition().y+this.rowHeight
        );
    } else if (children.length > 1) {
        var pos = this.root.getPosition();
        var leftBound = pos.x - (this.rowHeight * Math.tan((angle/2) * (Math.PI / 180)));
        var rightBound = pos.x + (this.rowHeight * Math.tan((angle/2) * (Math.PI / 180)));
        var width = rightBound - leftBound;
        var interval = width/(children.length-1);
        var i = 0;
        while (i < children.length) {
            children[i].move(leftBound+(interval*i),this.root.getPosition().y+this.rowHeight);
            i++;
        }

        var c = 0;
        var intersect = false;
        var newWidth = width;
        while (c < children.length-1) {
            var lChild = children[c];
            var rChild = children[c+1];
            var lNode = new Syntree.Tree({root:rChild}).getLeftMostNode();
            var rNode = new Syntree.Tree({root:lChild}).getRightMostNode();
            var lBBox = lNode.getLabelBBox();
            var rBBox = rNode.getLabelBBox();
            var lBound = lNode.getPosition().x - (lBBox.w/2);
            var rBound = rNode.getPosition().x + (rBBox.w/2);
            // if (Snap.path.intersection(lPath.pathString,rPath.pathString).length > 0) {
            if (rBound >= lBound) {
                intersect = true;
                var overlap = rBound - lBound;
                newWidth += Math.abs(overlap);
                newWidth += 20; //padding
            }
            c++;
        }

        if (intersect) {
            var newAngle = 2 * ((180/Math.PI) * (Math.atan(newWidth/(2*this.rowHeight))));
            var oldAngle = 2 * ((180/Math.PI) * (Math.atan(width/(2*this.rowHeight))));
            this.distribute(newAngle);
        }

    }

    if (Syntree.Lib.checkType(this.root.getParent(), 'node')) {
        var tree = new Syntree.Tree({
            root:this.root.getParent()
        });
        tree.distribute();
    } else {
        this.root.updateGraphics(true);
    }
}

Syntree.Tree.prototype.delete = function() {
    var nodes = this.getDescendantsOf(this.root,"",true,true);
    var i = 0;
    while (i < nodes.length) {
        nodes[i].delete();
        i++;
    }
}


Syntree.Tree.prototype.toString = function() {
return "[object Tree]"
}

Syntree.Tree.prototype._buildFromTreestring = function(treestring) {
    treestring = Syntree.Lib.checkArg(treestring, 'string');

    var node_entries = (treestring.split(';'));
    node_entries.pop(); // remove trailing item from split
    var node_entry_list = [];
    var i = 0;
    while (i < node_entries.length) {
        var node_config = {};
        var attrs = node_entries[i].split('|');
        var ii = 0;
        while (ii < attrs.length) {
            var name = attrs[ii].split(':')[0];
            var val = attrs[ii].split(':')[1];
            node_config[name] = val;
            ii++;
        }
        node_entry_list.push(node_config);
        i++;
    }
    var rootAttrs = {
        x: $('#workspace').width()/2,
        y: $('#toolbar').height()+20,
        labelContent: node_entry_list[0].labelContent,
        id: Number(node_entry_list[0].id),
    }
    this.root = new Syntree.Node(rootAttrs);
    this.root.editingAction('save');

    var n = 1;
    while (n < node_entry_list.length) {
        var entry = node_entry_list[n];
        var newnode = new Syntree.Node({
            labelContent:entry.labelContent,
            id:Number(entry.id)
        });
        newnode.editingAction('save');
        n++;
    }
    n = 0;
    while (n < node_entry_list.length) {
        var entry = node_entry_list[n];
        if (entry.children !== 'undefined') {
            var childIds = entry.children.split(',');
            var c = 0;
            while (c < childIds.length) {
                Syntree.Page.allNodes[entry.id].addChild(Syntree.Page.allNodes[childIds[c]]);
                c++;
            }
        }
        var temp = new Syntree.Tree({
            root:Syntree.Page.allNodes[entry.id]
        })
        temp.distribute();
        n++;
    }
}
