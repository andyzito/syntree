Syntree.Branch = function(parent,child) {
    parent = Syntree.Lib.checkArg(parent, 'node');
    child = Syntree.Lib.checkArg(child, 'node');
    child.parentBranch = this;
    parent.childBranches.push(this);
    this.parent = parent;
    this.child = child;

    Syntree.selectableElement.call(this);
}

Syntree.Branch.prototype.createGraphic = function() {
    this.startPoint = this.parent.getPosition();
    this.endPoint = this.child.getPosition();

    var line = Syntree.snap.line(
        this.startPoint.x,
        this.startPoint.y,
        this.endPoint.x,
        this.endPoint.y
    );

    line.attr({
        stroke:'black',
    });

    var config_matrix = {
        elements: {
            line: line,
        },
        states_synced: {

        },
        data_object: this,
        update_functions: {
            '#default': function(d,g) {
                d.startPoint = d.parent.getPosition();
                d.endPoint = d.child.getPosition();

                g.getEl('line').attr({
                    x1: d.startPoint.x,
                    y1: d.parent.getLabelBBox().y2 + 5,
                    x2: d.endPoint.x,
                    y2: d.child.getLabelBBox().y - 5,
                });
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

