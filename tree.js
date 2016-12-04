function Tree(P,root,x,y) {
	this.P = P;
	this.W = P.W;

	if (typeof root === 'undefined' || root === null) {
		this.root = this.P.makeNode(x,y,"A long piece of text");
	} else {
		this.root = root;
	}
	// this.nodes = {};
	// this.selected = null;
	this.rowHeight = 70;

	// Direct node control functions :
	// All other node control functions should interface through these
		
	this.editNode = function(node) {
		if (!node.selected) {
			this.P.selectNode(node);
		}
		node.edit();
	}

	// : direct node control functions.
	
	this.getSubtree = function(baseNode) {
		return new Tree(this.P,baseNode);
	}
	
	this.getPath = function(which) {
		if (typeof which === 'undefined' || which === 'both') {
			var Left = true;
			var Right = true;
		} else {
			var Left = which === 'left';
			var Right = which === 'right';
		}

		var Y = this.root.position().y - (this.root.labelSize().h/2);
			
		if (Right) {
			var rX = this.root.position().x - (this.root.labelSize().w/2);
			var rPathString = "M" + rX + "," + Y;
			rPathString += "H" + (rX + this.root.labelSize().w);
			var rX = rX + this.root.labelSize().w;
		}
		
		if (Left) {
			var lX = this.root.position().x + (this.root.labelSize().w/2);
			var lPathString = "M" + lX + "," + Y;
			lPathString += "H" + (lX - this.root.labelSize().w);
			var lX = lX - this.root.labelSize().w;
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
				var rPos = rNode.position();
				var rSize = rNode.labelSize();
				var rBound = rPos.x + (rSize.w/2);
				console.log(rNode.labelContent());
				console.log(rBound,rX);
				
				if (rBound < rX) {
					rPathString += "V" + (rPos.y - (rSize.h/2));
					rPathString += "H" + (rPos.x + (rSize.w/2));
				} else {
					rPathString += "H" + (rPos.x + (rSize.w/2));
					rPathString += "V" + (rPos.y - (rSize.h/2));
				}
				
				rX = (rPos.x + (rSize.w/2));
			}
			
			if (Left) {
				var lNode = rowNodes[0];
				var lPos = lNode.position();
				var lSize = lNode.labelSize();
				var lBound = lPos.x - (lSize.w/2);

				if (lBound > lX) {
					lPathString += "V" + (lPos.y - (lSize.h/2));
					lPathString += "H" + (lPos.x - (lSize.w/2));
				} else {
					lPathString += "H" + (lPos.x - (lSize.w/2));
					lPathString += "V" + (lPos.y - (lSize.h/2));				
				}
				
				lX = (lPos.x - (lSize.w/2));
			}
			row++;
		}
		
		var lNode = lastNodes[0];
		var rNode = lastNodes[lastNodes.length-1];
		var lBound = lNode.position().x - (lNode.labelSize().w/2);
		var rBound = rNode.position().x + (rNode.labelSize().w/2);
		
		if (Right) {
			rPathString += "V" + (rNode.position().y + (rNode.labelSize().h/2));
			rPathString += "H" + (lNode.position().x - (lNode.labelSize().w/2));
		}
		if (Left) {
			lPathString += "V" + (lNode.position().y + (lNode.labelSize().h/2));
			lPathString += "H" + (rNode.position().x + (rNode.labelSize().w/2));
		}
		
		if (Left && Right) {
			return lPathString + rPathString;
		} else if (Right) {
			return rPathString;
		} else if (Left) {
			return lPathString;
		}
	}
	
	this.makeChildOf = function(parentNode,left,text) {
		if (typeof text == 'undefined') {
			text = "";
		}
		var pos = parentNode.position();
		var size = parentNode.labelSize();

		var newChild = this.P.makeNode(pos.x,pos.y+this.rowHeight,text);

		newChild.parent = parentNode;

		if (left) {
			parentNode.children.unshift(newChild);
		} else {
			parentNode.children.push(newChild);
		}

		// var siblings = parentNode.children;
		// if (siblings.length > 1) {
			// var leftBound = pos.x - (this.rowHeight * Math.tan(30 * (Math.PI / 180)));
			// var rightBound = pos.x + (this.rowHeight * Math.tan(30 * (Math.PI / 180)));
			// var spread = rightBound - leftBound;
			// var interval = spread/(siblings.length-1);
			// var i = 0;
			// while (i < siblings.length) {
				// siblings[i].position(leftBound+(interval*i));
				// siblings[i].updateGraphic(500);
				// i = i+1;
			// }
		// }
		
		this.spread(parentNode);
		var branch = new Branch(parentNode,newChild);
		
		this.editNode(newChild);
		return newChild;
	}

	this.getChildrenOf = function(node,inclusive) {
		var result = {};
		var len = node.children.length;
		var i = 0;

		while (i < node.children.length) {
			var thisChild = node.children[i];
			result[thisChild.id] = this.getChildrenOf(thisChild);
			i = i + 1;
		}

		if (inclusive) {
			var t = node.id;
			temp = {};
			temp[t] = result;
			result = temp;
		}

		return result;
	}

	this.getSiblingsOf = function(node) {
		var parent = node.parent;
		var result = [];
		var c = 0;
		while (c < parent.children.length) {
			if (parent.children[c] != node) {
				result.push(parent.children[c]);
			}
		}
		return result;
	}
	
	this.getNodesByOffset = function(node,off) {
		// Adapted from http://stackoverflow.com/questions/13523951/how-to-check-the-depth-of-an-object Kavi Siegel's answer
		if (off == 0) {
			return [node];
		}

		var result = [];
		var children = node.children;
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

	this.spread = function(baseNode,angle) {
		if (typeof angle === 'undefined') {
			angle = 30;
		}
		
		// var siblings = parentNode.children;
		// if (siblings.length > 1) {
			// var leftBound = pos.x - (this.rowHeight * Math.tan(30 * (Math.PI / 180)));
			// var rightBound = pos.x + (this.rowHeight * Math.tan(30 * (Math.PI / 180)));
			// var spread = rightBound - leftBound;
			// var interval = spread/(siblings.length-1);
			// var i = 0;
			// while (i < siblings.length) {
				// siblings[i].position(leftBound+(interval*i));
				// siblings[i].updateGraphic(500);
				// i = i+1;
			// }
		// }
				
		var children = baseNode.children;
		if (children.length === 0) {
			return;
		} else if (children.length > 1) {
			var pos = baseNode.position();
			var leftBound = pos.x - (this.rowHeight * Math.tan(angle * (Math.PI / 180)));
			var rightBound = pos.x + (this.rowHeight * Math.tan(angle * (Math.PI / 180)));
			var width = rightBound - leftBound;
			var interval = width/(children.length-1);
			var i = 0;
			while (i < children.length) {
				children[i].position(leftBound+(interval*i));
				children[i].updateGraphic();
				// this.spread(children[i]);
				i++;
			}
		}
		
		var c = 0;
		var intersect = false;
		while (c < children.length-1) {
			var lChild = children[i];
			var rChild = children[i+1];
			var lPath = this.getSubtree(lChild).getPath();
			var rPath = this.getSubtree(rChild).getPath();
			if (Snap.path.intersection(lPath,rPath).length > 0) {
				intersect = true;
			}
			c++;
		}
		
		if (intersect) {
			this.spread(baseNode,angle+3);
		}
		
		if (baseNode.parent != null) {
			this.spread(baseNode.parent);
		}
	}
	
	// this.reposition = function() {		
		// var row = 0;
		// var off = 1;
		// var done = true;
		
		// this.spread(this.root);
		
		// while (off < 3) {
			// while (true) {
				// var nodes = this.getNodesByOffset(this.root,row);
				// if (nodes.length == 0) {
					// break;
				// }

				// var n = 0;
				// while (n < nodes.length-1) {
					// var leftNode = nodes[n];
					// var rightNode = nodes[n+1];
					
					// var leftChildren = this.getNodesByOffset(leftNode,off);
					// var rightChildren = this.getNodesByOffset(rightNode,off);
					// if (leftChildren.length === 0 || rightChildren.length === 0) {
						// n++;
						// continue;
					// }
					
					// var space = this.spaceBetween(leftChildren[leftChildren.length-1], rightChildren[0]);

					// if (space < 50) {
						// done = false;
						// var diff = 50 - space;
						// var m = diff/2;
						// if (leftNode.parent != rightNode.parent) {
							// var ancestors = this.getNearestParentSiblings(leftNode,rightNode);
							// ancestors[0].position(ancestors[0].position().x - m);
							// ancestors[1].position(ancestors[1].position().x + m);
						// } else {
							// leftNode.position(leftNode.position().x - m);
							// rightNode.position(rightNode.position().x + m);
						// }
					// }
					// n++;
				// }
				// row++;
			// }
			// off++;
		// }
		// if (!done) {
			// this.reposition();
		// } else {
			// this.root.updateGraphic(500);
		// }
	// }

	// Util:

	this.getDepthOf = function(object) {
		// Taken from http://stackoverflow.com/questions/13523951/how-to-check-the-depth-of-an-object Kavi Siegel's answer
		var level = 1;
		var key;
		
		for(key in object) {
			if (!object.hasOwnProperty(key)) continue;

			if(typeof object[key] == 'object'){
				var depth = this.getDepthOf(object[key]) + 1;
				level = Math.max(depth, level);
			}
		}
		return level;
	}
	
	this.getNearestParentSiblings = function(leftNode,rightNode) {
		if (leftNode.parent == rightNode.parent) {
			return [leftNode, rightNode];
		} else {
			return this.getNearestParentSiblings(leftNode.parent, rightNode.parent);
		}
	}
}