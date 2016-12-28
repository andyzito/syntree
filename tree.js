function Tree(P,root,x,y) {
	this.P = P;
	this.W = P.W;
	this.rowHeight = 70;

	if (typeof root === 'undefined' || root === null) {
		this.root = this.P.makeNode(x,y,"S");
		this.root.save();
	} else {
		this.root = root;
	}
	
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

		var rootBBox = this.root.getLabelBBox();
		var rootPos = this.root.position();
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
				var rPos = rNode.position();
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
				var lPos = lNode.position();
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
		var lPos = lNode.position();
		var rPos = rNode.position();
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
		
		return toReturn;
	}
	
	this.makeChildOf = function(parentNode,index,text) {
		if (typeof text == 'undefined') {
			text = "";
		}
		if (typeof index === 'undefined') {
			index = parentNode.children.length;
		}
		if (!parentNode.real) {
			return;
		}
		var pos = parentNode.position();

		var newChild = this.P.makeNode(pos.x,pos.y+this.rowHeight,text);

		newChild.parent = parentNode;

		parentNode.children.splice(index,0,newChild);
		
		this.spread(parentNode);
		var branch = new Branch(parentNode,newChild);
		
		this.P.selectNode(newChild);
		newChild.editToggle();
		return newChild;
	}

	this.getChildrenOf = function(node,inclusive) {
		var result = [];
		var len = node.children.length;
		var i = 0;

		while (i < node.children.length) {
			var thisChild = node.children[i];
			var push = {};
			push[thisChild.id] = this.getChildrenOf(thisChild);
			result.push(push);
			i = i + 1;
		}

		if (inclusive) {
			var t = node.id;
			temp = {};
			temp[t] = result;
			result = [temp];
		}

		return result;
	}

	this.getNodeOffset = function(fromNode,toNode) {
		if (fromNode === toNode) {
			return 0;
		}
		var currNode = toNode;
		var off = 1;
		while (true) {
			if (currNode.parent === fromNode) {
				break;
			} else if (currNode.parent === 'undefined') {
				return;
			} else {
				off++;
				currNode = currNode.parent;
				continue;
			}
		}
		return off;
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
	
	this.toBracket = function(node) {
		if (typeof node === 'undefined') {
			node = this.root;
		}
		
		var string = "[." + node.labelContent();
		if (node.children.length > 0) {
			var c = 0;
			while (c < node.children.length) {
				var thisChild = node.children[c];
				console.log(thisChild);
				var add = this.toBracket(thisChild);
				string += " " + add;
				console.log(string);
				c++;
			}
		}
		string += " ]";
		return string;
	}

	this.spread = function(baseNode,angle) {
		if (typeof angle === 'undefined') {
			angle = 50;
		}
		if (typeof baseNode === 'undefined') {
			return;
		}
				
		var children = baseNode.children;
		if (children.length === 0) {
			return;
		} else if (children.length === 1){
			children[0].position(baseNode.position().x)
		} else if (children.length > 1) {
			var pos = baseNode.position();
			var leftBound = pos.x - (this.rowHeight * Math.tan((angle/2) * (Math.PI / 180)));
			var rightBound = pos.x + (this.rowHeight * Math.tan((angle/2) * (Math.PI / 180)));
			var width = rightBound - leftBound;
			var interval = width/(children.length-1);
			var i = 0;
			while (i < children.length) {
				children[i].position(leftBound+(interval*i));
				i++;
			}

			var c = 0;
			var intersect = false;
			var newWidth = width;
			while (c < children.length-1) {
				
				var lChild = children[c];
				var rChild = children[c+1];
				var lPath = this.getSubtree(lChild).getPath();
				var rPath = this.getSubtree(rChild).getPath();
				if (Snap.path.intersection(lPath.pathString,rPath.pathString).length > 0) {
					intersect = true;
					var overlap = lPath.rightBound - rPath.leftBound;
					newWidth += overlap;
					newWidth += 10; //padding
				}
				c++;
			}
			
			if (intersect) {
				var newAngle = (180/Math.PI) * (2 * (Math.atan((newWidth/2)/this.rowHeight)));
				this.spread(baseNode,newAngle);
			}

		}
		
		if (typeof baseNode.parent != 'undefined') {
			this.spread(baseNode.parent);
		} else {
			this.root.updateGraphic();
		}
	}
	
}