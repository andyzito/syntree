// function Action() {
// 	this.id = W.genId();
//     this.type = type;

//     H.addAction(this);
// }

function ActionSelect(node) {
	this.id = W.genId();
	this.type = 'select';
	this.node = node;

	H.addAction(this);
}

function ActionCreate(node) {
	this.id = W.genId();
	this.type = 'create';
	this.node = node;

	this.undo = function() {
		W.page.nodeDelete(this.node);
	}

	H.addAction(this);
}

function ActionDelete(tree,parent,index) {
	this.id = W.genId();
	this.type = 'delete';
	this.tree = tree.getTreeString();
	this.parent = parent;
	this.index = index;

	this.nodes = {};
	var descendants = tree.getDescendantsOf(tree.root,'id',true,true);
	var i = 0;
	while (i < descendants.length) {
		this.nodes[String(descendants[i])] = W.page.allNodes[String(descendants[i])];
		i++;
	}

	this.undo = function() {
		W.page.openTree(this.tree,this.parent,this.index);
	}

	H.addAction(this);
}

function ActionSave(node,pre,post) {
	this.id = W.genId();
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

	H.addAction(this);
}