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

// function ActionDelete(node,index) {
// 	this.id = W.genId();
// 	this.type = 'delete';
// 	this.node = node;
// 	this.index = index;

// 	this.undo = function() {
// 		var attrs = {
// 			id: this.node.id,
// 			x: this.node.x,
// 			y: this.node.y,
// 			labelContent: this.node.labelContent,
// 		}
// 		var newNode = new Node(attrs);
// 		newNode.parent.addChild(newNode,this.index);
// 	}
// }

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