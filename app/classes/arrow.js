Syntree.Arrow = function(parent,child) {
    parent = Syntree.Lib.checkArg(parent, 'node');
    child = Syntree.Lib.checkArg(child, 'node');

    this.startPoint = parent.getPosition();
    this.endPoint = child.getPosition();

    this.line = Syntree.snap.path(
            "M " + this.startPoint.x + " " + this.startPoint.y +
            ", C " + this.startPoint.x + " " + this.startPoint.y +
            ", " + this.endPoint.x + " " + this.endPoint.y +
            ", " + this.endPoint.x + " " + this.endPoint.y
        );
    this.line.attr({
        stroke:'black',
        strokeDasharray: '5, 5',
        fill: 'none',
    });
    $(this.line.node).attr('marker-end', 'url(#Triangle)');
    child.toArrow = this;
    parent.fromArrow = this;

    this.parent = parent;
    this.child = child;

    this.updateGraphics();
}

Syntree.Arrow.prototype.getStartPoint = function() {
    var path = this.line.attr('path');
    path = path.split(',');
    var start = path[0];
    start = start.split(' ');
    start = {
        x: Number(start[1].trim()),
        y: Number(start[2].trim()),
    }
    return start;
}

Syntree.Arrow.prototype.setStartPoint = function(x,y) {
    var newStart = "M " + x + " " + y + ",";
    var path = this.line.attr('path');
    path = path.substr(path.indexOf(',')+1, path.length);
    path = newStart + path;
    this.line.attr('path', path);
}

Syntree.Arrow.prototype.setEndPoint = function(x,y) {
    var newEnd = ", " + x + " " + y;
    var path = this.line.attr('path');
    path = path.substr(0, path.lastIndexOf(','));
    path = path + newEnd;
    this.line.attr('path', path);
}

Syntree.Arrow.prototype.getEndPoint = function() {
    var path = this.line.attr('path');
    console.log(path)
    path = path.split(',');
    console.log(path);
    var end = path[path.length-1];
    end = end.split(' ');
    console.log(end);
    end = {
        x: Number(end[1].trim()),
        y: Number(end[2].trim()),
    }
    return end;
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
    var endPoints = {
        x1: cS.s1.includes('x') ? pBBox[cS.s1]+p1 : pBBox.cx,
        y1: cS.s1.includes('y') ? pBBox[cS.s1]+p1 : pBBox.cy,
        x2: cS.s2.includes('x') ? cBBox[cS.s2]+p2 : cBBox.cx,
        y2: cS.s2.includes('y') ? cBBox[cS.s2]+p2 : cBBox.cy,
    };
    this.setStartPoint(endPoints.x1, endPoints.y1);
    this.setEndPoint(endPoints.x2, endPoints.y2);
}

Syntree.Arrow.prototype.delete = function() {
    this.line.remove();
    this.parent.fromArrow = undefined;
}

Syntree.Arrow.prototype.getStartCtrlPoint = function() {
    var path = this.line.attr('path');
    path = path.split('C')[1];
    path = path.split(',')[0].trim().split(' ');
    return {
      x: Number(path[0]),
      y: Number(path[1]),
    }
}

Syntree.Arrow.prototype.setStartCtrlPoint = function(x,y) {
    var path = this.line.attr('path');
    var half1 = path.substr(0, path.indexOf('C') + 2);
    var half2 = path.substr(path.lastIndexOf(',', path.lastIndexOf(',')-1));
    var newPoint = x + " " + y;
    this.line.attr('path', half1 + newPoint + half2);
}

Syntree.Arrow.prototype.setEndCtrlPoint = function(x,y) {
    var path = this.line.attr('path');
    var half1 = path.substr(0, path.indexOf(',', path.indexOf('C'))+2);
    var half2 = path.substr(path.lastIndexOf(',', path.length));
    var newPoint = x + " " + y;
    this.line.attr('path', half1 + newPoint + half2);
}

Syntree.Arrow.prototype.getEndCtrlPoint = function() {
    var path = this.line.attr('path');
    path = path.split('C')[1];
    path = path.split(',')[1].trim().split(' ');
    return {
      x: Number(path[0]),
      y: Number(path[1]),
    }
}

Syntree.Arrow.prototype.setCurve = function() {
    var path = this.line.attr('path');
    var startCtrlPoint = this.getStartCtrlPoint();
    var endCtrlPoint = this.getEndCtrlPoint();
    var intersect = false;
    for (id in Syntree.Page.allNodes) {
        var node = Syntree.Page.allNodes[id];
        if (node === this.parent || node === this.child) {
            continue;
        }
        var nodePath = node.getPath();
        if (Snap.path.intersection(nodePath, path).length > 0) {
            intersect = true;
        }
    }
    if (intersect) {
        this.setStartCtrlPoint(startCtrlPoint.x-10,startCtrlPoint.y);
        this.setEndCtrlPoint(endCtrlPoint.x-10,endCtrlPoint.y);
        this.setCurve();
    } else {
        return;
    }
}