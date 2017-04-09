Syntree.workspace_constructor = function(config_matrix) {
    Syntree.snap = Snap("#workspace"); // Ensure that the snap variable exists
    Syntree.Workspace = this; // Ensure that workspace is available to objects created from within this constructor
    Syntree.History = new History();

    // Config map provides information about configurable properties passed in from the constructor
    this.accept_unmapped_config = false; // Accept config properties that are not in the map below?
    this.config_map = {
        goal_sentence: {
            type: 'string',
            default_value: '#undefined',
        },
        tutorial_enabled: {
            type: 'boolean',
            default_value: false,
        },
        upload_enabled: {
            type: 'boolean',
            default_value: true,
        },
        save_tree_script: {
            // The path to the script for saving a tree; see this._eventSave below
            // This script should return the tree's id on success, false on failure
            type: 'string',
            default_value: '#undefined',
        },
        get_trees_script: {
            // The path to the script for retrieving saved trees
            // This script should return some HTML on success and false on failure
            type: 'string',
            default_value: '#undefined',
        },
        export_tree_script: {
            // The path to the php script for exporting a tree; see this._eventExport below
            // This script should return a download link for the export file on success, false on failure
            type: 'string',
            default_value: '#undefined',
        },
        focus_checking_enabled: {
            // Should we do focus checking? Set to 'true' if embedded, 'false' for full page
            type: 'boolean',
            default_value: false,
        },
    }
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
                Syntree.Workspace._eventRewatchTutorial();
            });
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

    // Make the page
    this.page = new Syntree.page_constructor();
    this.page.addTree();
    this.page.nodeSelect(this.page.tree.getRoot());
}


Syntree.workspace_constructor.prototype._attachEventListeners = function() {
    // Store 'this' as local variable to avoid conflicts in callback scope
    var W = this;
    // Basic events, funneled to event functions below
    $(document).on('click', '.node-label', function() {W._eventNodeClick(this);});
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
}

Syntree.workspace_constructor.prototype._eventRewatchTutorial = function() {
    var check;
    if (Syntree.Tutorial.running) {
        check = confirm("Restart tutorial?");
    } else {
        check = confirm("This will delete any work you have open. Start tutorial anyway?");
    }
    if (check) {
        Syntree.Page.tree.delete();
        Syntree.Page.addTree();
        Syntree.Page.nodeSelect(Syntree.Page.tree.getRoot());
        Syntree.Tutorial.start();
    }
}

Syntree.workspace_constructor.prototype._eventUndo = function() {
    Syntree.History.undo();
}

Syntree.workspace_constructor.prototype._eventUpload = function() {
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
}

Syntree.workspace_constructor.prototype._eventNodeClick = function(clickedNode) {
    clickedNode = Syntree.Lib.checkArg(clickedNode, 'svgtextelement');
    var node = this.page.allNodes[$(clickedNode).attr('id').split('-')[1]];
    this.page.nodeSelect(node);
}

Syntree.workspace_constructor.prototype._eventLeft = function(e) {
    if ($(document.activeElement).hasClass('editor') && $(document.activeElement).val() !== '') {
        return;
    }
    if (!e.ctrlKey) {
        this.page.navigateHorizontal('left');
    } else {
        this.page.navigateHorizontal('left',true);
    }
}

Syntree.workspace_constructor.prototype._eventRight = function(e) {
    if ($(document.activeElement).hasClass('editor') && $(document.activeElement).val() !== '') {
        return;
    }
    if (!e.ctrlKey) {
        this.page.navigateHorizontal('right');
    } else {
        this.page.navigateHorizontal('right',true);
    }
}

Syntree.workspace_constructor.prototype._eventUp = function() {
    this.page.navigateUp();
}

Syntree.workspace_constructor.prototype._eventDown = function(e) {
    if (Syntree.Lib.checkType(e, 'object') && Syntree.Lib.checkType(e.ctrlKey, 'boolean') && e.ctrlKey) {
        this.page.navigateDown(true);
    } else {
        this.page.navigateDown();
    }
}

Syntree.workspace_constructor.prototype._eventDel = function() {
    this.page.nodeDelete();
}

Syntree.workspace_constructor.prototype._eventEsc = function() {
    this.page.nodeEditing('cancel');
}

Syntree.workspace_constructor.prototype._eventEditorTyping = function() {
    this.page.nodeEditing('update');
}

Syntree.workspace_constructor.prototype._eventBGClick = function(e) {
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
}

Syntree.workspace_constructor.prototype._eventFiletypeLabelClick = function(e) {
    var clicked = $(e.currentTarget).children('input');
    if ($(clicked).val() == 'bracket-file') {
        $('.modal_option__fname span').text('.txt');
    } else if ($(clicked).val() == 'tree-file') {
        $('.modal_option__fname span').text('.tree');
    } else if ($(clicked).val() == 'png') {
        $('.modal_option__fname span').text('.png');
    }
}

Syntree.workspace_constructor.prototype._eventExportImage = function() {
    var svgstring = '<svg>'+this.page.getSVGString()+'</svg>';
    canvg('export-image-canvas', svgstring);
    var canvas = document.getElementById('export-image-canvas');
    var imgd = canvas.toDataURL("image/png");
    var link = '<a id="temp-file-download" href="'+imgd+'" download="mytree.png"></a>';
    $('body').append(link);
    $(link)[0].click();
}

Syntree.workspace_constructor.prototype._eventExportTreeFile = function() {
    var fname = $('.modal_option__fname input').val();
    var treestring = this.page.tree.getTreeString();
    if (Syntree.Lib.checkType(this.export_tree_script, 'string')) {
        $.post(this.export_tree_script, {fname: fname, type: 'tree-file', treestring: treestring}, function(link){
            $('body').append(link);
            $('#temp-file-download')[0].click();
            $('#temp-file-download').remove();
        })

    }
}

Syntree.workspace_constructor.prototype._eventExportBrackets = function() {
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
}

Syntree.workspace_constructor.prototype._eventSave = function() {
    var treestring = this.page.tree.getTreeString();
    var W = this;
    if (Syntree.Lib.checkType(this.save_tree_script, 'string')) {
        $.post(this.save_tree_script,{treestring:treestring,treeid:this.page.tree.getId()},function(result){
            if (Number(result)) {
                if (!Syntree.Lib.checkType(Syntree.Page.tree.getId(), 'number')) {
                    W.page.tree.setId(Number(result));
                }
                alert('Saved');
            } else {
                alert('Sorry, there was a problem saving your tree');
            }
        });
    }
}

Syntree.workspace_constructor.prototype._eventFocus = function() {
    $(".focus_check_overlay").hide();
    $(".focus_check_underlay").show();
    window.scrollTo($("#workspace").offset().left,$("#workspace").offset().top);
    // $('body').css('overflow','hidden');
    $('#workspace_container').css('z-index',103);
    this.focused = true;
}

Syntree.workspace_constructor.prototype._eventUnfocus = function() {
    $(".focus_check_overlay").show();
    $(".focus_check_underlay").hide();
    $('body').css('overflow','initial');
    $('#workspace_container').css('z-index',0);
    this.focused = false;
}

Syntree.workspace_constructor.prototype._eventEnter = function() {
    this.page.nodeEditing('toggle');
}