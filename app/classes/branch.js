Syntree.Branch = function(parent,child) {
    parent = Syntree.Lib.checkArg(parent, 'node');
    child = Syntree.Lib.checkArg(child, 'node');
    child.parentBranch = this;
    parent.childBranches.push(this);
    this.parent = parent;
    this.child = child;
    this.triangle = false;

    Syntree.selectableElement.call(this);
}

Syntree.Branch.prototype.createGraphic = function() {
    this.startPoint = this.parent.getPosition();
    this.endPoint = this.child.getPosition();

    var shadowLine = Syntree.snap.line(
        this.startPoint.x,
        this.startPoint.y,
        this.endPoint.x,
        this.endPoint.y
    );

    shadowLine.attr({
        stroke: 'lightgrey',
        strokeWidth: '10px',
        class: 'branch-shadow',
        id: 'branch-shadow-'+this.id,
    });

    var line = Syntree.snap.line(
    );

    line.attr({
        stroke:'black',
        class: 'branch',
        id: 'branch-'+this.id,
    });

    var triangle = Syntree.snap.path(this.getTrianglePath());
    triangle.attr({
        stroke: 'black',
        fill: 'none',
        class: 'triangle',
        id: 'triangle-' + this.id,
    })

    var mid = this.getMidPoint();
    var triangleButton = Syntree.snap.image(
        '/resources/triangle_button_triangle.png',
        mid.x,
        mid.y,
        15,
        15
    );
    triangleButton.attr({
        class: 'triangle-button',
        id: 'triangle-button-'+this.id,
    })

    var config_matrix = {
        elements: {
            line: line,
            shadowLine: shadowLine,
            triangleButton: triangleButton,
            triangle: triangle,
        },
        states_synced: {
            selected: false,
            triangle: false,
            parentPosition: false,
            childPosition: false,
        },
        data_object: this,
        update_functions: {
            triangle: function(d,g) {
                if (d.triangle) {
                    g.getEl('triangle').attr({
                        path: d.getTrianglePath(),
                    });
                    g.getEl('line').attr({
                        strokeWidth: 0,
                    });
                    g.getEl('shadowLine').attr({
                        strokeWidth: 0,
                    });
                    g.getEl('triangleButton').attr({
                        href: '/resources/triangle_button_triangle.png',
                    });
                } else {
                    g.getEl('triangle').attr({
                        path: '',
                    });
                    g.getEl('line').attr({
                        strokeWidth: 1,
                    });
                    g.getEl('shadowLine').attr({
                        strokeWidth: 10,
                    });
                    g.getEl('triangleButton').attr({
                        href: '/resources/triangle_button_branch.png',
                    });
                }
            },
            'selected': function(d,g) {
                if (d.selected) {
                    g.getEl('shadowLine').attr({
                        opacity: 1,
                    });
                    g.getEl('triangleButton').attr({
                        visibility: 'visible',
                    });
                    g.getEl('triangle').attr({
                        fill: 'lightgrey',
                    })
                } else {
                    g.getEl('shadowLine').attr({
                        opacity: 0,
                    })
                    g.getEl('triangleButton').attr({
                        visibility: 'hidden',
                    });
                    g.getEl('triangle').attr({
                        fill: 'white',
                    })
                }
            },

            parentPosition: function(d,g) {
                d.startPoint = d.parent.getPosition();
                var pBBox = d.parent.getLabelBBox();
                g.getEl('line').attr({
                    x1: d.startPoint.x,
                    y1: pBBox.y2 + 5,
                });
                g.getEl('shadowLine').attr({
                    x1: d.startPoint.x,
                    y1: pBBox.y2 + 5,
                });
            },

            childPosition: function(d,g) {
                d.endPoint = d.child.getPosition();
                var cBBox = d.child.getLabelBBox();
                g.getEl('line').attr({
                    x2: d.endPoint.x,
                    y2: cBBox.y - 5,
                });
                g.getEl('shadowLine').attr({
                    x2: d.endPoint.x,
                    y2: cBBox.y - 5,
                });
            },

            '#default': function(d,g) {
                if (d.selected) {
                    var mid = d.getMidPoint();
                    g.getEl('triangleButton').attr({
                        x: mid.x-7.5,
                        y: mid.y-7.5,
                    })
                }

                if (d.triangle) {
                    g.getEl('triangle').attr({
                        path: d.getTrianglePath(),
                    });
                }
            }
        }
    }
    this.graphic = new Syntree.Graphic(config_matrix);
}

Syntree.Branch.prototype.toString = function() {
    return "[object Branch]"
}

Syntree.Branch.prototype.__delete = function() {
    this.parent.childBranches.splice(this.parent.childBranches.indexOf(this.parentBranch), 1);
}

Syntree.Branch.prototype.getMidPoint = function() {
    var s = this.getStartPoint();
    var e = this.getEndPoint();

    return {
        x: (s.x + e.x)/2,
        y: (s.y + e.y)/2,
    }
}

Syntree.Branch.prototype.triangleToggle = function() {
    if (this.triangle) {
        this.triangle = false;
        this.graphic.unsync('triangle');
    } else {
        this.triangle = true;
        this.graphic.unsync('triangle');
    }
    this.updateGraphics();
}

Syntree.Branch.prototype.getStartPoint = function() {
    return {
        x: this.parent.getPosition().x,
        y: this.parent.getLabelBBox().y2 + 5,
    }
}

Syntree.Branch.prototype.getEndPoint = function() {
    return {
        x: this.child.getPosition().x,
        y: this.child.getLabelBBox().y - 5,
    }
}

Syntree.Branch.prototype.getTrianglePath = function() {
    var start = this.startPoint;
    start.y = this.parent.getLabelBBox().y2 + 5;
    var cBBox = this.child.getLabelBBox();
    var botLeft = {
        x: cBBox.x,
        y: cBBox.y,
    }
    var botRight = {
        x: cBBox.x2,
        y: cBBox.y,
    }

    s = "M " + start.x + " " + start.y + ", ";
    s += "L " + botLeft.x + " " + (botLeft.y-5) + ", ";
    s += "L " + botRight.x + " " + (botRight.y-5) + ", ";
    s += "L " + start.x + " " + start.y + ", ";
    return s;
}