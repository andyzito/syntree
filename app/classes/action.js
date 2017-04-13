Syntree.Action = function(type,data) {
    type = Syntree.Lib.checkArg(type, 'string');
    data = Syntree.Lib.checkArg(data, 'object', '#undefined');

    this.id = Syntree.Lib.genId();
    this.type = type;

    this.toString = function() {
        return "[object Action]";
    }

    var a = "_Action" + Syntree.Lib.capitalize(type);
    Syntree[a].call(this,data)

    Syntree.History.addAction(this,data);
}

Syntree._ActionSelect = function(data) {
    data = Syntree.Lib.checkArg(data, 'object', '#undefined');
    this.selected_obj = Syntree.Lib.checkArg(data.selected_obj, data.selected_obj.isSelectable);
}

Syntree._ActionCreate = function(data) {
    data = Syntree.Lib.checkArg(data, 'object', '#undefined');
    this.created_obj = Syntree.Lib.checkArg(data.created_obj, data.created_obj.isElement);

    if (Syntree.Lib.checkType(this.created_obj, 'node')) {
        this.undo = function() {
            console.log('undoing create')
            Syntree.ElementsManager.deleteTree(this.created_obj);
        }
    } else if (Syntree.Lib.checkType(this.created_obj, 'arrow')) {
        this.undo = function() {
            this.created_obj.delete();
        }
    }
}

// function ActionCreateArrow(arrow) {
//     arrow = Syntree.Lib.checkArg(arrow, 'arrow');

//     this.id = Syntree.Lib.genId();
//     this.type = 'createArrow';
//     this.arrow = arrow;

//     this.undo = function() {
//         this.arrow.delete(true);
//     }

//     Syntree.History.addAction(this);
// }

// function ActionDeleteArrow(arrow) {
//     arrow = Syntree.Lib.checkArg(arrow, 'arrow');

//     this.id = Syntree.Lib.genId();
//     this.type = 'deleteArrow';
//     this.arrow = arrow;
//     this.path = arrow.graphic.getEl('line').attr('path');

//     this.undo = function() {
//         var arrow = new Syntree.Arrow(this.arrow.parent, this.arrow.child);
//         arrow.graphic.getEl('line').attr({
//             path: this.path,
//         });
//         arrow.updateGraphics();
//     }

//     Syntree.History.addAction(this);
// }

Syntree._ActionDelete = function(data) {
    data = Syntree.Lib.checkArg(data, 'object', '#undefined');
    this.deleted_obj = Syntree.Lib.checkArg(data.deleted_obj, ['node', 'tree', 'arrow']);

    if (Syntree.Lib.checkType(this.deleted_obj, 'tree')) {
        this.treestring = this.deleted_obj.getTreeString();
        this.parent = Syntree.Lib.checkArg(data.parent, 'node', '#undefined');
        this.index = Syntree.Lib.checkArg(data.index, 'number', 0);

        this.undo = function() {
            Syntree.Page.openTree(this.treestring,this.parent,this.index);
        }
    } else if (Syntree.Lib.checkType(this.deleted_obj, 'arrow')) {
        this.fromNode = Syntree.Lib.checkArg(data.fromNode, 'node');
        this.toNode = Syntree.Lib.checkArg(data.toNode, 'node');
        this.path = Syntree.Lib.checkArg(data.path, 'string');

        this.undo = function() {
            new Syntree.Arrow({
                fromNode: this.fromNode,
                toNode: this.toNode,
                path: this.path,
            });
        }
    }

    // this.nodes = {};
    // var descendants = tree.getDescendantsOf(tree.root,'id',true,true);
    // var i = 0;
    // while (i < descendants.length) {
    //     this.nodes[String(descendants[i])] = Syntree.ElementsManager.allElements[String(descendants[i])];
    //     i++;
    // }

    // this.undo = function() {
    //     Syntree.Page.openTree(this.tree,this.parent,this.index);
    // }
}

Syntree._ActionSave = function(data) {
    data = Syntree.Lib.checkArg(data, 'object', '#undefined');
    this.node = Syntree.Lib.checkArg(data.node, 'node');
    this.pre = Syntree.Lib.checkArg(data.pre, 'string');
    this.post = Syntree.Lib.checkArg(data.post, 'string');

    if (this.pre !== this.post) {
        this.undo = function() {
            this.node.labelContent = this.pre;
            this.node._labelbbox = undefined;
            this.node.graphic.unsync('labelContent');
            this.node.graphic.unsync('position');
            this.node.updateGraphics();
        }
    }
}

// (function(){
// var actionToString = function() {
//     return "[object Action]";
// }

// ActionSave.prototype.toString = actionToString;
// ActionDelete.prototype.toString = actionToString;
// ActionSelect.prototype.toString = actionToString;
// ActionCreate.prototype.toString = actionToString;
// ActionCreateArrow.prototype.toString = actionToString;
// ActionDeleteArrow.prototype.toString = actionToString;
// })()

Syntree.Action.prototype.toString = function() {
    return "[object Action]";
}