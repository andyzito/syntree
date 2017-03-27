// function Action() {
//     this.id = Syntree.Workspace.genId();
//     this.type = type;

//     Syntree.History.addAction(this);
// }

function ActionSelect(node) {
    node = Syntree.Lib.checkArg(node, 'node');

    this.id = Syntree.Lib.genId();
    this.type = 'select';
    this.node = node;

    Syntree.History.addAction(this);
}

function ActionCreate(node) {
    node = Syntree.Lib.checkArg(node, 'node');

    this.id = Syntree.Lib.genId();
    this.type = 'create';
    this.node = node;

    this.undo = function() {
        console.log('undoing');
        Syntree.Workspace.page.nodeDelete(this.node);
    }

    Syntree.History.addAction(this);
}

function ActionDelete(tree,parent,index) {
    tree = Syntree.Lib.checkArg(tree, 'tree');
    parent = Syntree.Lib.checkArg(parent, 'node', '#undefined');
    index = Syntree.Lib.checkArg(index, 'number', '#undefined');

    this.id = Syntree.Lib.genId();
    this.type = 'delete';
    this.tree = tree.getTreeString();
    this.parent = parent;
    this.index = index;

    this.nodes = {};
    var descendants = tree.getDescendantsOf(tree.root,'id',true,true);
    var i = 0;
    while (i < descendants.length) {
        this.nodes[String(descendants[i])] = Syntree.Workspace.page.allNodes[String(descendants[i])];
        i++;
    }

    this.undo = function() {
        Syntree.Page.openTree(this.tree,this.parent,this.index);
    }

    Syntree.History.addAction(this);
}

function ActionSave(node,pre,post) {
    node = Syntree.Lib.checkArg(node, 'node');
    pre = Syntree.Lib.checkArg(pre, 'string');
    post = Syntree.Lib.checkArg(post, 'string');

    this.id = Syntree.Lib.genId();
    this.type = 'save';
    this.node = node;
    this.preSaveLabelContent = pre;
    this.postSaveLabelContent = post;

    if (this.preSaveLabelContent !== this.postSaveLabelContent) {
        this.undo = function() {
            this.node.labelContent = this.preSaveLabelContent;
            this.node.updateGraphics();
        }
    }

    Syntree.History.addAction(this);
}

(function(){
var actionToString = function() {
    return "[object Action]";
}

ActionSave.prototype.toString = actionToString;
ActionDelete.prototype.toString = actionToString;
ActionSelect.prototype.toString = actionToString;
ActionCreate.prototype.toString = actionToString;
})()