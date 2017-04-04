function Branch(parent,child) {
    parent = Syntree.Lib.checkArg(parent, 'node');
    child = Syntree.Lib.checkArg(child, 'node');

    this.startPoint = parent.getPosition();
    this.endPoint = child.getPosition();

    this.line = Syntree.snap.line(this.startPoint.x,this.startPoint.y,this.endPoint.x,this.endPoint.y);
    this.line.attr({
        stroke:'black'
    });
    child.parentBranch = this;
    parent.childBranches.push(this);

    this.parent = parent;
    this.child = child;

    this.updateGraphics = function() {
        this.startPoint = this.parent.getPosition();
        this.endPoint = this.child.getPosition();

        this.line.attr({
            x1: this.startPoint.x,
            y1: this.parent.getLabelBBox().y2 + 5,
            x2: this.endPoint.x,
            y2: this.child.getLabelBBox().y - 5,
        })
    }

    this.delete = function() {
        this.line.remove();
        this.parent.childBranches.splice(this.parent.childBranches.indexOf(this.parentBranch), 1);
    }
}

Branch.prototype.toString = function() {
    return "[object Branch]"
}