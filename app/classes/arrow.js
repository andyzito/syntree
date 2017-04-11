Syntree.Arrow = function(parent,child) {
    parent = Syntree.Lib.checkArg(parent, 'node');
    child = Syntree.Lib.checkArg(child, 'node');

    this.startPoint = parent.getPosition();
    this.endPoint = child.getPosition();

    child.toArrow = this;
    parent.fromArrow = this;

    this.parent = parent;
    this.child = child;

    Syntree.selectableElement.call(this);
    this.updateGraphics();
}

Syntree.Arrow.prototype.createGraphic = function() {
    console.log(this);
    var path = "M " + this.startPoint.x + " " + this.startPoint.y +
            ", C " + this.startPoint.x + " " + this.startPoint.y +
            ", " + this.endPoint.x + " " + this.endPoint.y +
            ", " + this.endPoint.x + " " + this.endPoint.y;

    var shadowLine = Syntree.snap.path(path);
    shadowLine.attr({
        stroke: 'lightgrey',
        strokeWidth: '5px',
        class: 'arrow-shadow',
        id: 'arrow-shadow-' + this.id,
    })

    var line = Syntree.snap.path(path);
    line.attr({
        stroke:'black',
        strokeDasharray: '5, 5',
        fill: 'none',
        class: 'arrow',
        id: 'arrow-' + this.id,
    });
    $(line.node).attr('marker-end', 'url(#Triangle)');

    var config_matrix = {
        elements: {
            line: line,
            shadowLine: shadowLine,
        },
        states_synced: {
            selected: false,
        },
        data_object: this,
        update_functions: {
            selected: function(d,g) {
                console.log('inside selected function thingy')
                if (d.selected) {
                    console.log("is selected");
                    g.getEl('shadowLine').attr({
                        opacity: 100,
                    });
                    g.getEl('handle1').attr({
                        r: 3,
                    })
                    g.getEl('handle2').attr({
                        r: 3,
                    })
                } else {
                    console.log('is not selected');
                    g.getEl('shadowLine').attr({
                        opacity: 0,
                    });
                    g.getEl('handle1').attr({
                        r: 0,
                    })
                    g.getEl('handle2').attr({
                        r: 0,
                    })
                }
            }
        }
    }

    this.graphic = new Syntree.Graphic(config_matrix);

    var scp = this.getStartCtrlPoint();
    var ecp = this.getEndCtrlPoint();
    var handle1 = Syntree.snap.circle(scp.x, scp.y, 3);
    var handle2 = Syntree.snap.circle(ecp.x, ecp.y, 3);
    handle1.attr({
        fill: 'blue',
        stroke: 'blue',
        class: 'handle1',
        id: 'handle1-' + this.id,
    });
    handle2.attr({
        fill: 'red',
        stroke: 'red',
        class: 'handle2',
        id: 'handle2-' + this.id,
    });

    this.graphic.addElement('handle1', handle1);
    this.graphic.addElement('handle2', handle2);
}

Syntree.Arrow.prototype.select = function() {
    this.selected = true;
    this.graphic.unsync('selected');
    this.updateGraphics();
}

Syntree.Arrow.prototype.getStartPoint = function() {
    var path = this.graphic.getEl('line').attr('path');
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
    var path = this.graphic.getEl('line').attr('path');
    path = path.substr(path.indexOf(',')+1, path.length);
    path = newStart + path;
    this.graphic.getEl('line').attr('path', path);
}

Syntree.Arrow.prototype.setEndPoint = function(x,y) {
    var newEnd = ", " + x + " " + y;
    var path = this.graphic.getEl('line').attr('path');
    path = path.substr(0, path.lastIndexOf(','));
    path = path + newEnd;
    this.graphic.getEl('line').attr('path', path);
}

Syntree.Arrow.prototype.getEndPoint = function() {
    var path = this.graphic.getEl('line').attr('path');
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
    this.setStartPoint(pBBox.cx, pBBox.cy);
    this.setEndPoint(cBBox.cx, cBBox.cy);
    this.graphic.update();
    // this.setCurve();

    // var cS = Syntree.Lib.getClosestSides(
    //     pBBox,
    //     cBBox
    // );
    // var p1 = cS.s1.includes('2') ? 5 : -5;
    // var p2 = cS.s2.includes('2') ? 5 : -5;
    // var endPoints = {
    //     x1: cS.s1.includes('x') ? pBBox[cS.s1]+p1 : pBBox.cx,
    //     y1: cS.s1.includes('y') ? pBBox[cS.s1]+p1 : pBBox.cy,
    //     x2: cS.s2.includes('x') ? cBBox[cS.s2]+p2 : cBBox.cx,
    //     y2: cS.s2.includes('y') ? cBBox[cS.s2]+p2 : cBBox.cy,
    // };
    // this.setStartPoint(endPoints.x1, endPoints.y1);
    // this.setEndPoint(endPoints.x2, endPoints.y2);
}

Syntree.Arrow.prototype.delete = function() {
    this.graphic.getEl('line').remove();
    this.parent.fromArrow = undefined;
}

Syntree.Arrow.prototype.getStartCtrlPoint = function() {
    var path = this.graphic.getEl('line').attr('path');
    path = path.split('C')[1];
    path = path.split(',')[0].trim().split(' ');
    return {
      x: Number(path[0]),
      y: Number(path[1]),
    }
}

Syntree.Arrow.prototype.setStartCtrlPoint = function(x,y) {
    var path = this.graphic.getEl('line').attr('path');
    var half1 = path.substr(0, path.indexOf('C') + 2);
    var half2 = path.substr(path.lastIndexOf(',', path.lastIndexOf(',')-1));
    var newPoint = x + " " + y;
    this.graphic.getEl('line').attr('path', half1 + newPoint + half2);
}

Syntree.Arrow.prototype.setEndCtrlPoint = function(x,y) {
    var path = this.graphic.getEl('line').attr('path');
    var half1 = path.substr(0, path.indexOf(',', path.indexOf('C'))+2);
    var half2 = path.substr(path.lastIndexOf(',', path.length));
    var newPoint = x + " " + y;
    this.graphic.getEl('line').attr('path', half1 + newPoint + half2);
}

Syntree.Arrow.prototype.getEndCtrlPoint = function() {
    var path = this.graphic.getEl('line').attr('path');
    path = path.split('C')[1];
    path = path.split(',')[1].trim().split(' ');
    return {
      x: Number(path[0]),
      y: Number(path[1]),
    }
}

Syntree.Arrow.prototype.setCurve = function() {
    var path = this.graphic.getEl('line').attr('path');
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
        var pInter = Snap.path.intersection(path, this.parent.getPath())[0];
        var cInter = Snap.path.intersection(path, this.child.getPath())[0];
        console.log(pInter);
        console.log(cInter);
        this.setStartPoint(pInter.x, pInter.y);
        this.setEndPoint(cInter.x, cInter.y);
        // console.log(Snap.path.intersection(path, this.parent.getPath()));
        return;
    }
}