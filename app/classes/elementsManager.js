Syntree.ElementsManager = {
	allElements: {},

	allSelectables: {},

	selectedElement: undefined,

	register: function(obj) {
		if (Syntree.Lib.checkType(obj.select, 'function')) {
			this.allSelectables[obj.getId()] = obj;
		}
		this.allElements[obj.getId()] = obj;
	},

	deregister: function(obj) {
		if (Syntree.Lib.checkType(obj.select, 'function')) {
			delete this.allSelectables[obj.getId()];
		}
		delete this.allElements[obj.getId()];
	},

	select: function(obj) {
		if (!Syntree.Lib.checkType(this.selectedElement, 'undefined')) {
			this.deselect();
		}

		this.selectedElement = obj;
		obj.select();

		new Syntree.Action('select', {
			selected_obj: obj,
		});
	},

	deselect: function() {
		this.selectedElement.deselect();
		this.selectedElement = undefined;
	},

	// delete: function(obj) {
	// 	obj = Syntree.Lib.checkArg(obj, ['node', 'arrow'], this.getSelected());

	// 	if (obj.deleted) {
	// 		return;
	// 	}

	// 	if (Syntree.Lib.checkType(obj, 'node')) {
	// 	    if (obj === Syntree.Page.tree.root) {
	// 	        var children = Syntree.Page.tree.root.getChildren().slice();
	// 	        var c = 0;
	// 	        while (c < children.length) {
	// 	            this.delete(children[c]);
	// 	            c++;
	// 	        }
	// 	    }
	// 	}

	// 	if (!Syntree.Lib.checkType(obj, 'branch')) {
	// 		this.selectedElement.delete();
	// 	}
	// },

	deleteTree: function(tree) {
		tree = Syntree.Lib.checkArg(tree, ['tree', 'node']);
		if (Syntree.Lib.checkType(tree, 'node')) {
			tree = new Syntree.Tree({
				root: tree,
			});
		}

		var parent = tree.root.getParent();
        new Syntree.Action('delete', {
            deleted_obj: tree,
            parent: parent,
            index: parent.getChildren().indexOf(tree.root),
        });
        tree.delete();
        if (Syntree.Lib.checkType(parent, 'node')) {
            tree = new Syntree.Tree({
                root:parent
            });
            tree.distribute();
        }
	},

	isRegistered: function(obj) {
		return !Syntree.Lib.checkType(this.allElements[obj], ['undefined', 'null']);
	},

	getSelected: function() {
		return this.selectedElement;
	},
}