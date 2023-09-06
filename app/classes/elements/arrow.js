Syntree.config_maps.arrow = {};
Syntree.config_maps.arrow.accept_unmapped_config = false;
Syntree.config_maps.arrow.map = {
    id: {
        require: 'number',
        default_value: '#undefined',
    },
    /**
     * Node the arrow starts at.
     *
     * @type {Syntree.Node}
     *
     * @memberof Syntree.Arrow
     */
    fromNode: {
        require: 'node',
    },
    /**
     * Node the arrow ends at.
     *
     * @type {Syntree.Node}
     *
     * @memberof Syntree.Arrow
     */
    toNode: {
        require: 'node',
    },
    /**
     * Path string of the arrow line.
     *
     * @type {string}
     *
     * @memberof Syntree.Arrow
     */
    path: {
        require: 'string',
        default_value: '#undefined',
    },
}

/**
 * @class
 * @classdesc Represents a movement arrow.
 * @extends Syntree.Element
 * @extends Syntree.SelectableElement
 */
Syntree.Arrow = function(config_matrix) {
    this.id = config_matrix.id;
    Syntree.Lib.config(config_matrix,this);
    // Syntree.SelectableElement.call(this); // Extends
    Syntree.Lib.extend(Syntree.SelectableElement,Syntree.Arrow,this);

    this.toNode.toArrow = this;
    this.fromNode.fromArrow = this;

    this.updateGraphics();

    new Syntree.Action('create', {
        created_obj: this,
    });
}

/**
 * Create graphical elements and compile them into a new instance of Syntree.Graphic.
 *
 * @memberof Syntree.Graphic
 */
Syntree.Arrow.prototype.createGraphic = function() {
    var startPoint = this.fromNode.getPosition();
    var endPoint = this.toNode.getPosition();
    if (Syntree.Lib.checkType(this.path, 'string')) {
        var path = this.path;
    } else {
        var path = 'M ' + startPoint.x + ' ' + startPoint.y +
                ', C ' + startPoint.x + ' ' + startPoint.y +
                ', ' + endPoint.x + ' ' + endPoint.y +
                ', ' + endPoint.x + ' ' + endPoint.y;
    }

    var shadowLine = Syntree.snap.path(path);
    shadowLine.attr({
        stroke: 'lightgrey',
        strokeWidth: '5px',
        class: 'arrow-shadow',
        id: 'arrow-shadow-' + this.id,
        fill: 'none',
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

    var mid = Syntree.Lib.getMidPoint({
        x1: startPoint.x,
        y1: startPoint.y,
        x2: endPoint.x,
        y2: endPoint.y,
    })
    // var lockButton = Syntree.snap.image('/resources/lock.svg', mid.x, mid.y, 10, 10);

    var config_matrix = {
        elements_to_add: {
            shadowLine: {
                el_obj: shadowLine,
            },
            line: {
                el_obj: line,
                include_in_svg_string: true,
            },
            // lockButton: {
            //     el_obj: lockButton,
            // }
        },
        states_synced: {
            selected: false,
        },
        data_object: this,
        update_map: {
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
                    handle1: {
                        stateTrueAttrs: {
                            r: 5,
                        },
                        stateFalseAttrs: {
                            r: 0,
                        },
                    },
                    handle2: {
                        stateTrueAttrs: {
                            r: 5,
                        },
                        stateFalseAttrs: {
                            r: 0,
                        },
                    },
                }
            }
        }
    }

    this.graphic = new Syntree.Graphic(config_matrix);

    var scp = this.getStartCtrlPoint();
    var ecp = this.getEndCtrlPoint();
    var handle1 = Syntree.snap.circle(scp.x, scp.y, 5);
    var handle2 = Syntree.snap.circle(ecp.x, ecp.y, 5);
    handle1.attr({
        fill: 'lightblue',
        stroke: 'darkblue',
        class: 'handle1',
        id: 'handle1-' + this.id,
    });
    handle2.attr({
        fill: 'pink',
        stroke: 'red',
        class: 'handle2',
        id: 'handle2-' + this.id,
    });

    var customDrag1 = function(dx, dy, posx, posy) {
        this.attr({
            cx: posx,
            cy: posy,
        });
        var id = this.attr('id')
        id = id.substr(id.lastIndexOf('-')+1, id.length);
        var arrow = Syntree.Workspace.page.allElements[id];
        var t = Syntree.Lib.visualToActualCoordinates(
            Number(this.attr('cx')),
            Number(this.attr('cy'))
        );
        arrow.setStartCtrlPoint(
            t.x,
            t.y
        );
        arrow.updateGraphics();
    }

    var customDrag2 = function(dx, dy, posx, posy) {
        this.attr({
            cx: posx,
            cy: posy,
        });
        var id = this.attr('id')
        id = id.substr(id.lastIndexOf('-')+1, id.length);
        var arrow = Syntree.Workspace.page.allElements[id];
        var t = Syntree.Lib.visualToActualCoordinates(
            Number(this.attr('cx')),
            Number(this.attr('cy'))
        );
        arrow.setEndCtrlPoint(
            t.x,
            t.y
        );
        arrow.updateGraphics();
    }

    handle1.drag(customDrag1);
    handle2.drag(customDrag2);

    this.graphic.addElement('handle1', {
        el_obj: handle1,
    });
    this.graphic.addElement('handle2', {
        el_obj: handle2,
    });

    if (!Syntree.Lib.checkType(this.path, 'string')) {
        var path = this.graphic.getEl('line').attr('path');
        var fInter = Snap.path.intersection(path, this.fromNode.getPath());
        fInter = fInter[fInter.length-1];
        var tInter = Snap.path.intersection(path, this.toNode.getPath());
        tInter = tInter[tInter.length-1];
        this.setStartPoint(fInter.x, fInter.y);
        this.setEndPoint(tInter.x, tInter.y);
        var xsmooth1 = fInter.x > tInter.x ? -10 : 10;
        var xsmooth2 = fInter.x > tInter.x ? 10 : -10;
        this.setStartCtrlPoint(fInter.x+xsmooth1, fInter.y+30);
        this.setEndCtrlPoint(tInter.x+xsmooth2, tInter.y+30);
    }
}

/**
 * Get start point of path.
 *
 * @returns {object} - x and y coordinates
 *
 * @see Syntree.Arrow#path
 */
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

/**
 * Set start point of path.
 *
 * @param {number} - x coordinate
 * @param {number} - y coordinate
 *
 * @see Syntree.Arrow#path
 */
Syntree.Arrow.prototype.setStartPoint = function(x, y) {
    var newStart = 'M ' + x + ' ' + y + ',';
    var path = this.graphic.getEl('line').attr('path');
    path = path.substr(path.indexOf(',')+1, path.length);
    path = newStart + path;
    this.graphic.getEl('line').attr('path', path);
}

/**
 * Set end point of path.
 *
 * @param {number} - x coordinate
 * @param {number} - y coordinate
 *
 * @see Syntree.Arrow#path
 */
Syntree.Arrow.prototype.setEndPoint = function(x,y) {
    var newEnd = ', ' + x + ' ' + y;
    var path = this.graphic.getEl('line').attr('path');
    path = path.substr(0, path.lastIndexOf(','));
    path = path + newEnd;
    this.graphic.getEl('line').attr('path', path);
}

/**
 * Get end point of path.
 *
 * @returns {object} - x and y coordinates
 *
 * @see Syntree.Arrow#path
 */
Syntree.Arrow.prototype.getEndPoint = function() {
    var path = this.graphic.getEl('line').attr('path');
    path = path.split(',');
    var end = path[path.length-1];
    end = end.split(' ');
    end = {
        x: Number(end[1].trim()),
        y: Number(end[2].trim()),
    }
    return end;
}

Syntree.Arrow.prototype.toString = function() {
    return '[object Arrow]'
}

/**
 * Custom addition to Syntree.Element#updateGraphics.
 *
 * @see Syntree.Element#updateGraphics
 */
Syntree.Arrow.prototype.__updateGraphics = function() {
    var fBBox = this.fromNode.getLabelBBox();
    var tBBox = this.toNode.getLabelBBox();
    this.setStartPoint(fBBox.cx, fBBox.cy);
    this.setEndPoint(tBBox.cx, tBBox.cy);

    var scp = this.getStartCtrlPoint();
    var ecp = this.getEndCtrlPoint();
    this.graphic.getEl('handle1').attr({
        cx: scp.x,
        cy: scp.y,
    });
    this.graphic.getEl('handle2').attr({
        cx: ecp.x,
        cy: ecp.y,
    });

    var path = this.graphic.getEl('line').attr('path');
    var tInter = Snap.path.intersection(path, this.toNode.getPath());

    if (this.fromNode.getLabelContent().match(/^\s.*$|^$/)) {
        var pos = this.fromNode.getPosition();
        this.setStartPoint(pos.x, pos.y);
    } else {
        var fInter = Snap.path.intersection(path, this.fromNode.getPath());
        if (fInter.length > 0) {
            fInter = fInter.reduce(function(l, e) {
                return e.t1 < l.t1 ? e : l;
            });
            this.setStartPoint(fInter.x, fInter.y);
        }
    }

    if (this.toNode.getLabelContent().match(/^\s.*$|^$/)) {
        var pos = this.toNode.getPosition();
        this.setEndPoint(pos.x, pos.y);
    } else {
        if (tInter.length > 0) {
            tInter = tInter.reduce(function(l, e) {
                return e.t1 > l.t1 ? e : l;
            });
            this.setEndPoint(tInter.x, tInter.y);
        }
    }

    this.graphic.getEl('shadowLine').attr({
        path: this.graphic.getEl('line').attr('path'),
    })
}

/**
 * Custom addition to Syntree.Element#delete.
 *
 * @see Syntree.Element#delete
 */
Syntree.Arrow.prototype.__delete = function() {
    // silent = Syntree.Lib.checkArg(silent, 'boolean', false);
    // console.log('deleting arrow');

    this.fromNode.fromArrow = undefined;
    this.toNode.toArrow = undefined;

    new Syntree.Action('delete', {
        deleted_obj: this,
        fromNode: this.fromNode,
        toNode: this.toNode,
        path: this.graphic.getEl('line').attr('path'),
    });
}

/**
 * Get control point for start of path.
 *
 * @returns {object} - x and y coordinates
 *
 * @see Syntree.Arrow#path
 */
Syntree.Arrow.prototype.getStartCtrlPoint = function() {
    var path = this.graphic.getEl('line').attr('path');
    path = path.split('C')[1];
    path = path.split(',')[0].trim().split(' ');
    return {
      x: Number(path[0]),
      y: Number(path[1]),
    }
}

/**
 * Set control point for start of path.
 *
 * @param {number} - x coordinate
 * @param {number} - y coordinate
 *
 * @see Syntree.Arrow#path
 */
Syntree.Arrow.prototype.setStartCtrlPoint = function(x, y) {
    var path = this.graphic.getEl('line').attr('path');
    var half1 = path.substr(0, path.indexOf('C') + 2);
    var half2 = path.substr(path.lastIndexOf(',', path.lastIndexOf(',')-1));
    var newPoint = x + ' ' + y;
    this.graphic.getEl('line').attr('path', half1 + newPoint + half2);
}

/**
 * Set control point for end of path.
 *
 * @param {number} - x coordinate
 * @param {number} - y coordinate
 *
 * @see Syntree.Arrow#path
 */
Syntree.Arrow.prototype.setEndCtrlPoint = function(x,y) {
    var path = this.graphic.getEl('line').attr('path');
    var half1 = path.substr(0, path.indexOf(',', path.indexOf('C'))+2);
    var half2 = path.substr(path.lastIndexOf(',', path.length));
    var newPoint = x + ' ' + y;
    this.graphic.getEl('line').attr('path', half1 + newPoint + half2);
}

/**
 * Get control point for end of path.
 *
 * @returns {object} - x and y coordinates
 *
 * @see Syntree.Arrow#path
 */
Syntree.Arrow.prototype.getEndCtrlPoint = function() {
    var path = this.graphic.getEl('line').attr('path');
    path = path.split('C')[1];
    path = path.split(',')[1].trim().split(' ');
    return {
      x: Number(path[0]),
      y: Number(path[1]),
    }
}
