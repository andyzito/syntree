function Tree(config_matrix) {
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
        }
    }

    Syntree.Lib.config(config_matrix,this);

    if (!Syntree.Lib.checkType(this.build_treestring, 'string') && !Syntree.Lib.checkType(this.root, 'node')) {
        throw new Error ('You must provide a root node or a treestring when making a new Tree instance');
    }

    if (Syntree.Lib.checkType(this.build_treestring, 'string')) {
        this._buildFromTreestring(this.build_treestring);
    }

    this.getId = function() {
        return this.id;
    }

    this.setId = function(id) {
        id = Syntree.Lib.checkArg(id, 'number');

        this.id = id;
    }

    this.getRoot = function() {
        return this.root;
    }

    this._getPath = function(which) {
        which = Syntree.Lib.checkArg(which, 'string', '#undefined');

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
            }
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

        var toReturn = {};
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

    this.getDescendantsOf = function(node,attr,inclusive,flat) {
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

    this.getNodeOffset = function(fromNode,toNode) {
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

    this.getNodesByOffset = function(node,off) {
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

    this.getTreeString = function() {
        var s = "";
        var nodes = this.getDescendantsOf(this.root,'',true,true);
        var i = 0;
        while (i < nodes.length) {
            var node = nodes[i];
            s += node.getId();
            s += "{";
            s += "labelContent:" + node.getLabelContent();
            if (node.getChildren().length > 0) {
                var children = node.getChildren().map(function(c){return c.getId()});
                s += "|children:" + children.join();
            }
            if (node.getParent()) {
                s += "|parent:" + node.getParent().getId();
            }
            s += "};";
            i++;
        }
        return s;
    }

    this.getBracketNotation = function(node) {
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

    this.getSVGString = function() {
        var s = "";
        var nodes = this.getDescendantsOf(this.root,'',true,true);
        var i = 0;
        while (i<nodes.length) {
            s += nodes[i].getSVGString();
            i++;
        }
        return s;
    }

    this.distribute = function(angle) {
        angle = Syntree.Lib.checkArg(angle, 'number', 50);

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
                var lPath = new Tree({root:lChild})._getPath();
                var rPath = new Tree({root:rChild})._getPath();
                if (Snap.path.intersection(lPath.pathString,rPath.pathString).length > 0) {
                    intersect = true;
                    var overlap = lPath.rightBound - rPath.leftBound;
                    newWidth += Math.abs(overlap);
                    newWidth += 10; //padding
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
            var tree = new Tree({root:this.root.getParent()});
            tree.distribute();
        } else {
            this.root.updateGraphics();
        }
    }

    this.delete = function() {
        var nodes = this.getDescendantsOf(this.root,"",true,true);
        var i = 0;
        while (i < nodes.length) {
            nodes[i].delete();
            i++;
        }
    }
}

Tree.prototype.toString = function() {
    return "[object Tree]"
}

Tree.prototype._buildFromTreestring = function(treestring) {
        treestring = Syntree.Lib.checkArg(treestring, 'string');

        var nodes = (treestring.split(';'));
        nodes.pop(); // remove trailing item from split
        var nodelist = [];
        var i = 0;
        while (i < nodes.length) {
            var node = {};
            node['id'] = nodes[i].split('{')[0];
            var attrs = nodes[i].split('{')[1].slice(0,-1).split('|');
            var ii = 0;
            while (ii < attrs.length) {
                var name = attrs[ii].split(':')[0];
                var val = attrs[ii].split(':')[1];
                node[name] = val;
                ii++;
            }
            nodelist.push(node);
            i++;
        }
        var rootAttrs = {
            x: $('#workspace').width()/2,
            y: $('#toolbar').height()+20,
            labelContent: nodelist[0].labelContent,
            id: Number(nodelist[0].id),
        }
        this.root = new Node(rootAttrs);
        this.root.editingAction('save');
        var n = 1;
        while (n < nodelist.length) {
            var newnode = new Node({labelContent:nodelist[n].labelContent,id:Number(nodelist[n].id)});
            newnode.editingAction('save');
            n++;
        }
        n = 0;
        while (n < nodelist.length) {
            if (Syntree.Lib.checkType(nodelist[n].children, 'array')) {
                var childids = nodelist[n].children.split(',');
                var c = 0;
                while (c < childids.length) {
                    Syntree.Page.allNodes[nodelist[n].id].addChild(Syntree.Workspace.page.allNodes[childids[c]]);
                    c++;
                }
            }
            var temp = new Tree({root:Syntree.Workspace.page.allNodes[nodelist[n].id]})
            temp.distribute();
            n++;
        }
    }
