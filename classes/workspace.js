function Workspace(init) {
    snap = Snap("#workspace"); // Ensure that the snap variable exists
    W = this; // Ensure that workspace is available to objects created from within this constructor

    // Gotta put this somewhere else... eventually...
    focusNoScroll = function(elem) {
      var x = window.scrollX, y = window.scrollY;
      elem.focus();
      window.scrollTo(x, y);
    }

    // Use 'init' object to set up some config variables
    // Is uploading enabled?
    this.upload_enabled = init['upload_enabled'];
    if (typeof this.upload_enabled === 'undefined') {
        this.upload_enabled = true; // Default to enabled
    }
    if (!this.upload_enabled) {
        $('.toolbar_button__upload').remove();
    }
    // The path to the script for saving a tree; see this._eventSave below
    // This script should return the tree's id on success, false on failure
    this.save_tree_script = init['save_tree_script'];
    if (typeof this.save_tree_script === 'undefined') {
        $('.toolbar_button__save').remove();
    }
    // The path to the script for retrieving saved trees
    // This script should return some HTML on success and false on failure
    this.get_trees_script = init['get_trees_script'];
    if (typeof this.get_trees_script === 'undefined') {
        $('.toolbar_button__open').remove();
        $('.modal_open').remove();
    }
    // The path to the php script for exporting a tree; see this._eventExport below
    // This script should return a download link for the export file on success, false on failure
    this.export_tree_script = init['export_tree_script'];
    if (typeof this.export_tree_script === 'undefined') {
        $('.toolbar_button__export').remove();
        $('.modal_export').remove();
    }
    // Should we do focus checking? Set to 'true' if embedded, 'false' for full page
    this.focus_checking_enabled = init['focus_checking_enabled'];
    if (this.focus_checking_enabled) {
        $("#workspace_container").prepend('<div class="focus_check_overlay"></div>');
        $("body").prepend('<div class="focus_check_underlay"></div>');
        $('.focus_check_underlay').hide();
        this.focused = false;
    }

    // Other properties
    this.allids = []; // To ensure local ids are unique

    this.genId = function() {
        n = 1000;
        if (this.allids.length === n) {
            n += 1000;
        }
        while (true) {
            var x = Math.floor(Math.random()*1000);
            if (this.allids.indexOf(x) === -1) {
                return x;
            }
        }
    }

    this._attachEventListeners = function() {
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
        if (typeof this.save_tree_script !== 'undefined') {
            $(document).on('click', '.toolbar_button__save', function(){W._eventSave()});
        }
        // Modal export
        if (typeof this.export_tree_script !== 'undefined') {
            $(document).on('click', '.modal_section__filetype .modal_label', function(e) {W._eventFiletypeLabelClick(e)});
            $(document).on('click', '.modal_button__export', function() {
                var type = $('.modal_section__filetype input:checked').val();
                if (type === 'bracket-file') {
                    W._eventExportBrackets();
                } else if (type === 'tree-file') {
                    W._eventExportTreeFile();
                } else if (type === 'png') {
                    W._eventExportImage();
                }
            });
        }
        // Upload
        if (this.upload_enabled) {
            $(document).on('click', '.toolbar_button__upload', function() {
                W._eventUpload();
            });
        }
        // Modal open
        if (typeof this.get_trees_script !== 'undefined') {
            $(document).on('click', '.toolbar_button__open', function() {
                $.post(W.get_trees_script, {}, function(result) {
                    $('.modal_section__trees').html(result);
                });
            });
        }
    }

    this._eventUndo = function() {
        H.undo();
    }

    this._eventUpload = function() {
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

    this._eventNodeClick = function(clickedNode) {
        var node = this.page.allNodes[$(clickedNode).attr('id').split('-')[1]];
        this.page.nodeSelect(node);
    }

    this._eventEnter = function() {
        this.page.nodeEditing('toggle');
    }

    this._eventLeft = function(e) {
        if ($(document.activeElement).hasClass('editor') && $(document.activeElement).val() !== '') {
            return;
        }
        if (!e.ctrlKey) {
            this.page.navigateHorizontal('left');
        } else {
            this.page.navigateHorizontal('left',true);
        }
    }

    this._eventRight = function(e) {
        if ($(document.activeElement).hasClass('editor') && $(document.activeElement).val() !== '') {
            return;
        }
        if (!e.ctrlKey) {
            this.page.navigateHorizontal('right');
        } else {
            this.page.navigateHorizontal('right',true);
        }
    }

    this._eventUp = function() {
        this.page.navigateUp();
    }

    this._eventDown = function(e) {
        if (!e.ctrlKey) {
            this.page.navigateDown();
        } else {
            this.page.navigateDown(true);
        }
    }

    this._eventDel = function() {
        this.page.nodeDelete();
    }

    this._eventEsc = function() {
        this.page.nodeEditing('cancel');
    }

    this._eventEditorTyping = function() {
        this.page.nodeEditing('update');
    }

    this._eventBGClick = function(e) {
        return; //temporary
        var x = e.pageX - $("#workspace").offset().left;
        var y = e.pageY - $("#workspace").offset().top;
        var nearest = this.page.getNearestNode(x,y);
        var newNode = new Node(0,0);

        if (typeof nearest === 'object') {
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

    this._eventFiletypeLabelClick = function(e) {
        var clicked = $(e.currentTarget).children('input');
        if ($(clicked).val() == 'bracket-file') {
            $('.modal_option__fname span').text('.txt');
        } else if ($(clicked).val() == 'tree-file') {
            $('.modal_option__fname span').text('.tree');
        } else if ($(clicked).val() == 'png') {
            $('.modal_option__fname span').text('.png');
        }
    }

    this._eventExportImage = function() {
        var svgstring = '<svg>'+this.page.getSVGString()+'</svg>';
        canvg('export-image-canvas', svgstring);
        var canvas = document.getElementById('export-image-canvas');
        var imgd = canvas.toDataURL("image/png");
        var link = '<a id="temp-file-download" href="'+imgd+'" download="mytree.png"></a>';
        $('body').append(link);
        $(link)[0].click();
    }

    this._eventExportTreeFile = function() {
        var fname = $('.modal_option__fname input').val();
        var treestring = this.page.tree.getTreeString();
        if (typeof this.export_tree_script !== 'undefined') {
            $.post(this.export_tree_script, {fname: fname, type: 'tree-file', treestring: treestring}, function(link){
                $('body').append(link);
                $('#temp-file-download')[0].click();
                $('#temp-file-download').remove();
            })

        }
    }

    this._eventExportBrackets = function() {
        // Get fname
        var fname = $('.modal_option__fname input').val();
        // Get brackets
        var brackets = this.page.tree.getBracketNotation();
        // Post it
        if (typeof this.export_tree_script !== 'undefined') {
            $.post(this.export_tree_script, {fname: fname, type: 'bracket-file', brackets: brackets}, function(link) {
                $('body').append(link);
                $('#temp-file-download')[0].click();
                $('#temp-file-download').remove();
            });
        }
    }

    this._eventSave = function() {
        var treestring = this.page.tree.getTreeString();
        var W = this;
        if (typeof this.save_tree_script !== 'undefined') {
            $.post(this.save_tree_script,{treestring:treestring,treeid:this.page.tree.getId()},function(result){
                if (Number(result)) {
                    if (typeof W.page.tree.getId() !== 'number') {
                        W.page.tree.setId(Number(result));
                    }
                    alert('Saved');
                } else {
                    alert('Sorry, there was a problem saving your tree');
                }
            });
        }
    }

    this._eventFocus = function() {
        $(".focus_check_overlay").hide();
        $(".focus_check_underlay").show();
        window.scrollTo($("#workspace").offset().left,$("#workspace").offset().top);
        // $('body').css('overflow','hidden');
        $('#workspace_container').css('z-index',103);
        this.focused = true;
    }

    this._eventUnfocus = function() {
        $(".focus_check_overlay").show();
        $(".focus_check_underlay").hide();
        $('body').css('overflow','initial');
        $('#workspace_container').css('z-index',0);
        this.focused = false;
    }

    this._attachEventListeners();

    // Make the page
    this.page = new Page();
    this.page.addTree();
    this.page.nodeSelect(this.page.tree.getRoot());
}
