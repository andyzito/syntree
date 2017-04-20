Syntree.config_maps.workspace = {};
Syntree.config_maps.workspace.accept_unmapped_config = false;
Syntree.config_maps.workspace.map = {
    goal_sentence: {
        require: 'string',
        default_value: '#undefined',
    },
    tutorial_enabled: {
        require: 'boolean',
        default_value: false,
    },
    upload_enabled: {
        require: 'boolean',
        default_value: true,
    },
    save_tree_script: {
        // The path to the script for saving a tree; see this._eventSave below
        // This script should return the tree's id on success, false on failure
        require: 'string',
        default_value: '#undefined',
    },
    get_trees_script: {
        // The path to the script for retrieving saved trees
        // This script should return some HTML on success and false on failure
        require: 'string',
        default_value: '#undefined',
    },
    export_tree_script: {
        // The path to the php script for exporting a tree; see this._eventExport below
        // This script should return a download link for the export file on success, false on failure
        require: 'string',
        default_value: '#undefined',
    },
    focus_checking_enabled: {
        // Should we do focus checking? Set to 'true' if embedded, 'false' for full page
        require: 'boolean',
        default_value: false,
    },
}


/**
 * @class
 * @classdesc Workspace is in charge of taking user input, sanitizing it, and sending it to the appropriate lower-level control structure.
 */
Syntree.Workspace = {

    initialize: function(config_matrix) {
        Syntree.Lib.config(config_matrix, this); // use config matrix to set up some properties

        if (this.tutorial_enabled) {
            $(document).ready(
                function() {
                    modal_open('tutorial')
                });
            $(document).on(
                'click',
                '.button_modal__begin-tutorial',
                function() {
                    Syntree.Tutorial.start()
                });
            $(document).on(
                'click',
                '.toolbar_button__tutorial',
                function() {
                    Syntree.W._eventRewatchTutorial();
                });
        } else {
            $('.toolbar_button__tutorial').remove();
        }

        if (!this.upload_enabled) {
            $('.toolbar_button__upload').remove();
        }
        if (Syntree.Lib.checkType(this.save_tree_script, 'undefined')) {
            $('.toolbar_button__save').remove();
        }
        if (Syntree.Lib.checkType(this.get_trees_script, 'undefined')) {
            $('.toolbar_button__open').remove();
            $('.modal_open').remove();
        }
        if (Syntree.Lib.checkType(this.export_tree_script, 'undefined')) {
            $('.toolbar_button__export').remove();
            $('.modal_export').remove();
        }
        if (this.focus_checking_enabled) {
            $("#workspace_container").prepend('<div class="focus_check_overlay"></div>');
            $("body").prepend('<div class="focus_check_underlay"></div>');
            $('.focus_check_underlay').hide();
            this.focused = false;
        }

        this._attachEventListeners();

        this.page = new Syntree.Page();
        this.page.addTree();
        Syntree.ElementsManager.select(this.page.tree.getRoot());
    },

    /**
     * Attach various event listeners needed for processing user input. This function is a convenience only, used so that [initialize()]{@link Workspace.initialize}) is a bit less cluttered.
     */
    _attachEventListeners: function() {
        // Store 'this' as local variable to avoid conflicts in callback scope
        var W = this;

        // This stuff is to fix dragging, which as default triggers on right click
        // We want it to NOT trigger on right click, so we maintain Workspace.rightClick
        // for the drag functions to check
        $(document).on('mousedown', function(e) {
            if (e.which === 3) {
                W.rightClick = true;
            }
        });
        $(document).on('mouseup', function(e) {
            if (e.which === 3) {
                W.rightClick = false;
            }
        });
        window.onblur = function() {
            W.rightClick = false;
        }
        // --------------------------------------------------------------------------
        $(document).on('click', '.arrow, .arrow-shadow', function(e) {W._eventArrowClick(e);});
        $(document).on('click', '.branch, .branch-shadow, .triangle', function(e) {W._eventBranchClick(e);});
        $(document).on('click', '.triangle-button', function(e) {W._eventTriangleButtonClick(e);});
        // Basic events, funneled to event functions below
        $(document).on('click', '.node-label', function(e) {W._eventNodeClick(e);});
        $(document).on('click', '.delete_button', function() {W._eventDel();});
        $(document).on('click', '#page-background', function(e) {W._eventBGClick(e);});
        $(document).on('dblclick', '.node-label', function() {W._eventEnter();});
        $(document).on('input', '.editor', function() {W._eventEditorTyping();});
        // Keyboard stuff
        $(document).on('keydown', function(e) {
            if ((W.focus_checking_enabled && W.focused) || !W.focus_checking_enabled) {
                if (e.keyCode === 13) { // Enter
                    W._eventEnter();
                } else if (e.keyCode === 37) { // Left arrow key
                    W._eventLeft(e);
                    // return false;
                } else if (e.keyCode === 38) { // Up arrow key
                    W._eventUp();
                    return false;
                } else if (e.keyCode === 39) { // Right arrow key
                    W._eventRight(e);
                    // return false;
                } else if (e.keyCode === 40) { // Down arrow key
                    W._eventDown(e);
                    return false;
                } else if (e.keyCode === 46) { // Delete key
                    W._eventDel();
                } else if (e.keyCode === 27) { // Esc key
                    W._eventEsc();
                } else if (e.keyCode === 90 && e.ctrlKey) { // CTRL + Z
                    W._eventUndo();
                }
            }
        });
        // Focus checking
        if (W.focus_checking_enabled) {
            $(document).on('click', '.focus_check_overlay', function(){W._eventFocus()});
            $(document).on('click', '.focus_check_underlay', function(){W._eventUnfocus()});
        }
        if (Syntree.Lib.checkType(this.save_tree_script, 'string')) {
            $(document).on('click', '.toolbar_button__save', function(){W._eventSave()});
        }
        // Modal export
        if (Syntree.Lib.checkType(this.export_tree_script, 'string')) {
            $(document).on('click', '.modal_section__filetype .modal_label', function(e) {W._eventFiletypeLabelClick(e)});
            $(document).on('click', '.button_modal__export', function() {
                $(this).addClass('loading');
                var type = $('.modal_section__filetype input:checked').val();
                if (type === 'bracket-file') {
                    W._eventExportBrackets();
                } else if (type === 'tree-file') {
                    W._eventExportTreeFile();
                } else if (type === 'png') {
                    W._eventExportImage();
                }
                $(this).removeClass('loading');
            });
        }
        // Upload
        if (this.upload_enabled) {
            $(document).on('click', '.toolbar_button__upload', function() {
                W._eventUpload();
            });
        }
        // Modal open
        if (Syntree.Lib.checkType(this.get_trees_script, 'string')) {
            $(document).on('click', '.toolbar_button__open', function() {
                $.post(W.get_trees_script, {}, function(result) {
                    $('.modal_section__trees').html(result);
                });
            });
        }
    },

    /**
     * Code to run when a branch's triangle button is clicked.
     *
     * @see Syntree.Branch
     */
    _eventTriangleButtonClick: function(e) {
        var clicked = e.currentTarget;
        var clickedId = $(clicked).attr('id');
        var id = Number(clickedId.substr(clickedId.lastIndexOf('-')+1, clickedId.length));
        Syntree.ElementsManager.allElements[id].triangleToggle();
    },

    /**
     * Code to run when a branch is clicked.
     *
     * @see Syntree.Branch
     * @see Syntree.ElementsManager.select
     */
    _eventBranchClick: function(e) {
        var clicked = e.currentTarget;
        var clickedId = $(clicked).attr('id');
        var id = Number(clickedId.substr(clickedId.lastIndexOf('-')+1, clickedId.length));
        Syntree.ElementsManager.select(Syntree.ElementsManager.allElements[id]);
    },

    /**
     * Code to run when an arrow is clicked.
     *
     * @see Syntree.Arrow
     * @see Syntree.ElementsManager.select
     */
    _eventArrowClick: function(e) {
        var clicked = e.currentTarget;
        var clickedId = $(clicked).attr('id');
        var id = Number(clickedId.substr(clickedId.lastIndexOf('-')+1, clickedId.length));
        Syntree.ElementsManager.select(Syntree.ElementsManager.allElements[id]);
    },

    /**
     * Code to run when a user requests a tutorial restart/rewatch.
     *
     * @see Syntree.Tutorial
     */
    _eventRewatchTutorial: function() {
        var check;
        if (Syntree.Tutorial.running) {
            check = confirm("Restart tutorial?");
        } else {
            check = confirm("This will delete any work you have open. Start tutorial anyway?");
        }
        if (check) {
            Syntree.Workspace.page.tree.delete();
            Syntree.Workspace.page.addTree();
            Syntree.ElementsManager.select(Syntree.Workspace.page.tree.getRoot());
            Syntree.Tutorial.start();
        }
    },

    /**
     * Code to run when a user attempts to undo an action.
     *
     * @see Syntree.History.undo
     * @see Syntree.Action
     */
    _eventUndo: function() {
        Syntree.History.undo();
    },

    _eventUpload: function() {
        var W = this;
        $('body').append('<input type="file" id="temp-choose-file">');
        $('#temp-choose-file').change(function() {
            var f = document.getElementById("temp-choose-file").files[0];
            if (f) {
                var reader = new FileReader();
                reader.readAsText(f, "UTF-8");
                reader.onload = function (e) {
                    W.page.openTree(e.target.result);
                }
                reader.onerror = function (e) {
                    alert('Unable to read file. Please upload a .tree file.')
                }
            }
            $('#temp-choose-file').remove();
        });
        $('#temp-choose-file').click();
    },

    /**
     * Code to run when a Node is clicked.
     *
     * @see Syntree.Node
     */
    _eventNodeClick: function(e) {
        // clickedNode = Syntree.Lib.checkArg(clickedNode, 'svgtextelement');
        var node = Syntree.ElementsManager.allElements[$(e.currentTarget).attr('id').split('-')[1]];
        if (e.ctrlKey) {
            var a = this.page.createMovementArrow(node);
            if (Syntree.Lib.checkType(a, 'arrow')) {
                Syntree.ElementsManager.select(a);
                return false;
            }
        }
        Syntree.ElementsManager.select(node);
    },

    /**
     * Code to run when the user presses the left arrow key.
     *
     * @see Syntree.Page#navigateHorizontal
     */
    _eventLeft: function(e) {
        if ($(document.activeElement).hasClass('editor') && $(document.activeElement).val() !== '') {
            return;
        }
        if (Syntree.Lib.checkType(e, 'object') && !e.ctrlKey) {
            this.page.navigateHorizontal('left');
        } else {
            this.page.navigateHorizontal('left',true);
        }
    },

    /**
     * Code to run when the user presses the right arrow key.
     *
     * @see Syntree.Page#navigateHorizontal
     */
    _eventRight: function(e) {
        if ($(document.activeElement).hasClass('editor') && $(document.activeElement).val() !== '') {
            return;
        }
        if (Syntree.Lib.checkType(e, 'object') && !e.ctrlKey) {
            this.page.navigateHorizontal('right');
        } else {
            this.page.navigateHorizontal('right',true);
        }
    },

    /**
     * Code to run when the user presses the up arrow key.
     *
     * @see Syntree.Page#navigateUp
     */
    _eventUp: function() {
        this.page.navigateUp();
    },

    /**
     * Code to run when the user presses the down arrow key.
     *
     * @see Syntree.Page#navigateDown
     */
    _eventDown: function(e) {
        if (Syntree.Lib.checkType(e, 'object') && Syntree.Lib.checkType(e.ctrlKey, 'boolean') && e.ctrlKey) {
            this.page.navigateDown(true);
        } else {
            this.page.navigateDown();
        }
    },

    /**
     * Code to run when the user tries to delete an [Element]{@link Syntree.Element}.
     */
    _eventDel: function() {
        var selected = Syntree.ElementsManager.getSelected();
        if (Syntree.Lib.checkType(selected, 'node')) {
            if (Syntree.Workspace.page.tree.root === selected) {
                var children = Syntree.Workspace.page.tree.root.getChildren().slice();
                var c = 0;
                while (c < children.length) {
                    var tree = new Syntree.Tree({
                        root: children[c],
                    })
                    Syntree.ElementsManager.deleteTree(tree);
                    c++;
                }
            } else {
                var tree = new Syntree.Tree({
                    root: selected,
                })
                Syntree.ElementsManager.deleteTree(tree);
            }
            Syntree.ElementsManager.deselect();
            if (!Syntree.Lib.checkType(Syntree.ElementsManager.getSelected(), 'node')) {
                Syntree.ElementsManager.select(Syntree.Workspace.page.tree.getRoot());
            }
        } else {
            selected.delete();
        }
    },

    /**
     * Code to run when the user presses the ESC key.
     */
    _eventEsc: function() {
        this.page.nodeEditing('cancel');
    },

    /**
     * Code to run when the user types in a [Node]{@link Syntree.Node} editor.
     */
    _eventEditorTyping: function() {
        this.page.nodeEditing('update');
    },

    _eventBGClick: function(e) {
        return; //temporary
        var x = e.pageX - $("#workspace").offset().left;
        var y = e.pageY - $("#workspace").offset().top;
        var nearest = this.page.getNearestNode(x,y);
        var newNode = new Syntree.Node(0,0);

        if (Syntree.Lib.checkType(nearest, 'object')) {
            if (nearest.deltaY < -10) {
                if (nearest.deltaX > 0) {
                    nearest.node.addChild(newNode,0);
                } else {
                    nearest.node.addChild(newNode);
                }
            } else {
                var childIndex = nearest.node.getParent().getChildren().indexOf(nearest.node);
                if (nearest.deltaX > 0) {
                    nearest.node.addChild(newNode,childIndex);
                } else {
                    nearest.node.addChild(newNode,childIndex+1);
                }
            }
        }
    },

    _eventFiletypeLabelClick: function(e) {
        var clicked = $(e.currentTarget).children('input');
        if ($(clicked).val() == 'bracket-file') {
            $('.modal_option__fname span').text('.txt');
        } else if ($(clicked).val() == 'tree-file') {
            $('.modal_option__fname span').text('.tree');
        } else if ($(clicked).val() == 'png') {
            $('.modal_option__fname span').text('.png');
        }
    },

    _eventExportImage: function() {
        var path = Syntree.Workspace.page.tree._getPath();
        var width = path.rightBound = path.leftBound;
        var height = path.bottomBound - path.topBound;
        var offsetX = (-1*path.leftBound + 25);
        var offsetY = (-1*path.topBound + 25);

        var svgstring = '<svg>'+this.page.getSVGString()+'</svg>';
        // $('#export-image-canvas').attr('width', (width+100));
        // $('#export-image-canvas').attr('height', (height+50));
        $('#export-image-canvas').attr('width', $('#workspace').width());
        $('#export-image-canvas').attr('height', $('#workspace').height());
        // console.log(svgstring);
        canvg('export-image-canvas', svgstring, {
            ignoreDimensions: false,
            // offsetX: (-1*path.leftBound+25),
            // offsetY: (-1*path.topBound+25),
            // scaleWidth: 5,
            // scaleHeight: 5,
        });
        var canvas = document.getElementById('export-image-canvas');
        var imgd = canvas.toDataURL("image/png");
        var link = '<a id="temp-file-download" href="'+imgd+'" download="mytree.png"></a>';
        $('body').append(link);
        $(link)[0].click();
    },

    _eventExportTreeFile: function() {
        var fname = $('.modal_option__fname input').val();
        var treestring = this.page.tree.getTreeString();
        if (Syntree.Lib.checkType(this.export_tree_script, 'string')) {
            $.post(this.export_tree_script, {fname: fname, type: 'tree-file', treestring: treestring}, function(link){
                $('body').append(link);
                $('#temp-file-download')[0].click();
                $('#temp-file-download').remove();
            })

        }
    },

    _eventExportBrackets: function() {
        $('.loading-icon').show();
        // Get fname
        var fname = $('.modal_option__fname input').val();
        // Get brackets
        var brackets = this.page.tree.getBracketNotation();
        // Post it
        if (Syntree.Lib.checkType(this.export_tree_script, 'string')) {
            $.post(this.export_tree_script, {fname: fname, type: 'bracket-file', brackets: brackets}, function(link) {
                $('body').append(link);
                $('#temp-file-download')[0].click();
                $('#temp-file-download').remove();
                $('.loading-icon').hide();
            });
        }
    },

    _eventSave: function() {
        var treestring = this.page.tree.getTreeString();
        var W = this;
        if (Syntree.Lib.checkType(this.save_tree_script, 'string')) {
            $.post(this.save_tree_script,{treestring:treestring,treeid:this.page.tree.getId()},function(result){
                if (Number(result)) {
                    if (!Syntree.Lib.checkType(Syntree.Workspace.page.tree.getId(), 'number')) {
                        W.page.tree.setId(Number(result));
                    }
                    alert('Saved');
                } else {
                    alert('Sorry, there was a problem saving your tree');
                }
            });
        }
    },

    _eventFocus: function() {
        $(".focus_check_overlay").hide();
        $(".focus_check_underlay").show();
        window.scrollTo($("#workspace").offset().left,$("#workspace").offset().top);
        // $('body').css('overflow','hidden');
        $('#workspace_container').css('z-index',103);
        this.focused = true;
    },

    _eventUnfocus: function() {
        $(".focus_check_overlay").show();
        $(".focus_check_underlay").hide();
        $('body').css('overflow','initial');
        $('#workspace_container').css('z-index',0);
        this.focused = false;
    },

    /**
     * Code to run when the user presses Enter.
     */
    _eventEnter: function() {
        this.page.nodeEditing('toggle');
    },

    toString: function() {
        return "[object Workspace]";
    }
}