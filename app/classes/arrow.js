Syntree.Arrow = function(parent,child) {
    parent = Syntree.Lib.checkArg(parent, 'node');
    child = Syntree.Lib.checkArg(child, 'node');

    this.startPoint = parent.getPosition();
    this.endPoint = child.getPosition();

    this.line = Syntree.snap.line(this.startPoint.x,this.startPoint.y,this.endPoint.x,this.endPoint.y);
    this.line.attr({
        stroke:'black',
        strokeDasharray: '5, 5',
    });
    child.toArrow = this;
    parent.fromArrow = this;

    this.parent = parent;
    this.child = child;

    this.updateGraphics();
}

Syntree.Arrow.prototype.toString = function() {
    return "[object Arrow]"
}

Syntree.Arrow.prototype.updateGraphics = function() {
    var pBBox = this.parent.getLabelBBox();
    var cBBox = this.child.getLabelBBox();

    var cS = Syntree.Lib.getClosestSides(
        pBBox,
        cBBox
    );

    var p1 = cS.s1.includes('2') ? 5 : -5;
    var p2 = cS.s2.includes('2') ? 5 : -5;
    this.line.attr({
        x1: cS.s1.includes('x') ? pBBox[cS.s1]+p1 : pBBox.cx,
        y1: cS.s1.includes('y') ? pBBox[cS.s1]+p1 : pBBox.cy,
        x2: cS.s2.includes('x') ? cBBox[cS.s2]+p2 : cBBox.cx,
        y2: cS.s2.includes('y') ? cBBox[cS.s2]+p2 : cBBox.cy,
    });
}

Syntree.Arrow.prototype.delete = function() {
    this.line.remove();
    this.parent.fromArrow = undefined;
}

