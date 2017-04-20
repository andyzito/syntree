// Syntree.ElementsManager = {
//     allElements: {},

//     allSelectables: {},

//     selectedElement: undefined,

//     register: function(obj) {
//         if (Syntree.Lib.checkType(obj.select, 'function')) {
//             this.allSelectables[obj.getId()] = obj;
//         }
//         this.allElements[obj.getId()] = obj;
//     },

//     deregister: function(obj) {
//         if (Syntree.Lib.checkType(obj.select, 'function')) {
//             delete this.allSelectables[obj.getId()];
//         }
//         delete this.allElements[obj.getId()];
//     },

//     select: function(obj) {
//         if (!Syntree.Lib.checkType(this.selectedElement, 'undefined')) {
//             this.deselect();
//         }

//         this.selectedElement = obj;
//         obj.select();

//         new Syntree.Action('select', {
//             selected_obj: obj,
//         });
//     },

//     deselect: function() {
//         this.selectedElement.deselect();
//         this.selectedElement = undefined;
//     },

//     deleteTree: function(tree) {
//         tree = Syntree.Lib.checkArg(tree, ['tree', 'node']);
//         if (Syntree.Lib.checkType(tree, 'node')) {
//             tree = new Syntree.Tree({
//                 root: Syntree.ElementsManager.allElements[tree.id],
//             });
//         }

//         var treestring = tree.getTreeString();
//         var parent = tree.root.getParent();
//         var index = parent.getChildren().indexOf(tree.root);
//         tree.delete();
//         if (Syntree.Lib.checkType(parent, 'node')) {
//             temptree = new Syntree.Tree({
//                 root:parent
//             });
//             temptree.distribute();
//         }
//         new Syntree.Action('delete', {
//             deleted_obj: tree,
//             treestring: treestring,
//             parent: parent,
//             index: index,
//         });
//     },

//     isRegistered: function(obj) {
//         return !Syntree.Lib.checkType(this.allElements[obj], ['undefined', 'null']);
//     },

//     getSelected: function() {
//         return this.selectedElement;
//     },

//     getElementsByType(type) {
//         type = Syntree.Lib.checkArg(type,'string');

//         var res = {};
//         for (id in this.allElements) {
//             if (Syntree.Lib.checkType(this.allElements[id], type)) {
//                 res[id] = this.allElements[id];
//             }
//         }
//         return res;
//     }
// }