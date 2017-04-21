/**
 * @class
 * @classdesc Represents the line connecting two nodes.
 * @extends Syntree.Element
 * @extends Syntree.SelectableElement
 */
Syntree.Branch = function(parent,child) {
    parent = Syntree.Lib.checkArg(parent, 'node');
    child = Syntree.Lib.checkArg(child, 'node');
    child.parentBranch = this;
    parent.childBranches.push(this);
    this.parent = parent;
    this.child = child;
    this.triangle = false;

    Syntree.SelectableElement.call(this);
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
        elements_to_add: {
            line: {
                el_obj: line,
                include_in_svg_string: true,
            },
            shadowLine: {
                el_obj: shadowLine,
            },
            triangleButton: {
                el_obj: triangleButton,
            },
            triangle: {
                el_obj: triangle,
            },
        },
        states_synced: {
            selected: false,
            triangle: false,
            parentPosition: false,
            childPosition: false,
        },
        data_object: this,
        update_map: {
            triangle: {
                state_name: 'triangle',
                handler: function(d,g) {
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
                }
            },
            selected: {
                state_name: 'selected',
                handler: 'boolean',
                elements: {
                    shadowLine: {
                        stateTrueAttrs: {
                            opacity: 1,
                        },
                        stateFalseAttrs: {
                            opacity: 0,
                        },
                    },
                    triangleButton: {
                        stateTrueAttrs: {
                            visibility: 'visible',
                        },
                        stateFalseAttrs: {
                            visibility: 'hidden',
                        },
                    },
                    triangle: {
                        stateTrueAttrs: {
                            fill: 'lightgrey',
                        },
                        stateFalseAttrs: {
                            fill: 'white',
                        }
                    },
                }
            },
            parentPosition: {
                state_name: 'parentPosition',
                handler: function(d,g) {
                    d.startPoint = d.parent.getPosition();
                    var pBBox = d.parent.getLabelBBox();
                    g.getEl('line').attr({
                        // x1: d.startPoint.x,
                        x1: pBBox.cx,
                        y1: pBBox.y2,
                        // y1: d.startPoint.y + (pBBox.height/2),
                    });
                    g.getEl('shadowLine').attr({
                        x1: d.startPoint.x,
                        y1: d.startPoint.y + (pBBox.height/2),
                    });
                }
            },
            childPosition: {
                state_name: 'childPosition',
                handler: function(d,g) {
                    d.endPoint = d.child.getPosition();
                    g.getEl('shadowLine').attr({
                        // x2: d.endPoint.x,
                        // x2: cBBox.x,
                        // y2: d.endPoint.y - (cBBox.height/2),
                        // y2: cBBox.y,
                    });
                }
            },
            '#default': function(d,g) {
                var cBBox = d.child.getLabelBBox();
                g.getEl('line').attr({
                    // x2: d.endPoint.x,
                    x2: cBBox.cx,
                    y2: cBBox.y,
                    // y2: d.endPoint.y - (cBBox.height/2),
                });
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
    this.parent.childBranches.splice(this.parent.childBranches.indexOf(this), 1);
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