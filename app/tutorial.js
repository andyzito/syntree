Syntree.Tutorial = {
    data: {
        node_naming_1: 0,
    },

    standard_message_interval: 2000,

    frames: [
        {
            message: "Hello! Welcome to Syntree",
        },
        {
            message: "Right now there is one node, called S",
            // arrows: [
            //     (function() {
            //         var id = Syntree.Page.tree.getRoot().getId();
            //         var pos = $("#label-" + id).position();
            //         var bbox = Syntree.Page.tree.getRoot().getLabelBBox();
            //         return {
            //             x: pos.left + 30,
            //             y: pos.top + (bbox.h / 2),
            //             from_direction: 'right',
            //         }
            //     }),
            // ]
        },
        {
            message: "You can tell it is selected because it is highlighted in gray",
        },
        {
            message: "Press the down arrow key to create a child node of S",
            gateway: {
                event_type: "keydown",
                condition: function(e) {
                    return e.keyCode === 40;
                },
            },
            arrows: false,
        },
        {
            message: "Good job!",
        },
        {
            message: "Now give this new node a name (just type!)",
            gateway: {
                event_type: "keypress",
                condition: function(e) {
                    if (e.key.length === 1) {
                        Syntree.Tutorial.data['node_naming_1'] += 1;
                    }
                    if (Syntree.Tutorial.data['node_naming_1'] > 2) {
                        return true;
                    }
                    return false;
                }
            },
        },
        {
            message: "And press Enter to make the new node permanent!",
            gateway: {
                event_type: "keydown",
                condition: function(e) {
                    return e.keyCode === 13;
                }
            },
        },
        {
            message: "Well done!",
        },
        {
            message: "Press left or right to create a sibling node",
            gateway: {
                event_type: "keydown",
                condition: function(e) {
                    return e.keyCode === 37 || e.keyCode === 39;
                },
            },
        },
        {
            message: "Name it and press Enter",
            gateway: {
                event_type: "keydown",
                condition: function(e) {
                    return e.keyCode === 13;
                },
            },
        },
        {
            message: "Woohoo! You've got a tiny tree!",
        },
        {
            message: "The arrow keys can also be used to navigate to existing nodes",
        },
        {
            message: "Navigate back to the root node",
            gateway: {
                event_type: "keydown",
                condition: function() {
                    return Syntree.Page.tree.root.getState('selected');
                },
            },
        },
        {
            message: "Note: to force node creation, instead of navigation, hold down CTRL + SHIFT",
            gateway: 5000,
        },
        {
            message: "Ok! You can press Enter, or double click, to edit the node",
            gateway: {
                event_type: [
                    "keydown",
                    "dblclick",
                    ],
                condition: function() {
                    return Syntree.Page.tree.getRoot().getState('editing');
                }
            },
        },
        {
            message: "You can edit it like regular text, and press Enter to save",
            gateway: {
                event_type: "keydown",
                condition: function(e) {
                    return e.keyCode === 13;
                },
            }
        },
        {
            message: "Remember, if you navigate away from a node without saving, your change will be lost!",
            gateway: 5000,
        },
        {
            message: "Similarly, if you navigate away from a new node that hasn't been saved, it will disappear.",
            gateway: 5000,
        },
        {
            message: "This makes it easy to fix accidental node creation -- if you press down and make a node you didn't want, just press up!",
            gateway: 5000,
        },
        {
            message: "Ok. Moving on.",
        },
        {
            message: "You can press CTRL + Z to undo most actions",
        },
        {
            message: "Try it now -- undo your actions until you're back to where you started!",
            gateway: {
                event_type: "keydown",
                condition: function() {
                    return Syntree.Page.tree.getRoot().getChildren().length === 0;
                },
            }
        },
        {
            message: "Great!"
        },
        {
            message: "That's all for now. For more help, click \"Help\" in the upper lefthand corner."
        },
    ],
    index: -1,
    running: false,

    continue: function() {
        this.index += 1;
        if (this.index < this.frames.length) {
            frame = this.frames[this.index];
            this.frame(frame);
        } else {
            this.quit();
        }
    },

    quit: function() {
        console.log('quit');
        this.index = Infinity;
        this.running = false;
        $('.tutorial_instruction').fadeOut(2000, function(){
            $(this).remove();
        });
    },

    frame: function(frame) {
        var message = Syntree.Lib.checkArg(frame.message, 'string');
        var gateway = Syntree.Lib.checkArg(frame.gateway, ['object', 'number'], 2700);

        this.instruction(message);
        if (Syntree.Lib.checkType(frame.arrows, 'array')) {
            var i = 0;
            while (i < frame.arrows.length) {
                if (Syntree.Lib.checkType(frame.arrows[i], 'function')) {
                    var arrow = frame.arrows[i]();
                    $('#workspace_container').append("<div class='tutorial_arrow from_" + arrow.from_direction + "'></div>");
                    $('.tutorial_arrow').css({
                        "top": arrow.y,
                        "left": arrow.x,
                    });
                    $('.tutorial_arrow').fadeIn(1500);
                }
                i++;
            }
        } else if (Syntree.Lib.checkType(frame.arrows, 'boolean') && !frame.arrows) {
            $('.tutorial_arrow').remove();
        }
        if (Syntree.Lib.checkType(gateway, 'number')) {
            setTimeout(
                (function() {
                    this.continue()
                }).bind(this), gateway);
        } else if (Syntree.Lib.checkType(gateway, 'object')) {
            var event_string = String(gateway.event_type).replace(',', '.syntree_tutorial ') + ".syntree_tutorial";
            $(document).on(event_string, (function(e) {
                if (gateway.condition(e)) {
                    $(document).off(event_string);
                    this.continue();
                }
            }).bind(this))
        }
    },

    instruction: function(text) {
        if ($('.tutorial_instruction:not(.primary)')) {
            $('.tutorial_instruction:not(.primary)').fadeOut(1000, function() {
                $(this).remove();
            });
        }
        if ($('.tutorial_instruction.primary')) {
            $('.tutorial_instruction.primary').removeClass('primary');
        }
        $("#workspace_container").append('<p class="tutorial_instruction primary">' + text + '</p>');
        $('.tutorial_instruction.primary').fadeIn(1500);
    },

    start: function() {
        modal_close('app');
        this.running = true;
        this.continue();
    },

    down: function() {

        this.instruction("The selected node is labeled S", 400, function() {
            this.instruction("Press the down arrow key to create a child node of S");
        });
        $(document).on('keydown.tutorial', (function(e) {
            if (e.keyCode === 40) {
                $('.tutorial_instruction').remove();
                $(document).off('keydown.tutorial');
                this.instruction("Good job!", 1000, this.continue);
            }
        }).bind(this))
    },

    label: function() {
        this.instruction("You can type to label the new node");
        $(document).on('input.tutorial', '.editor', (function(){
            $('.tutorial_instruction').remove();
            $(document).off('input.tutorial');
            this.instruction("And press Enter to save your change");
            $(document).on('keydown.tutorial', (function(e){
                if (e.keyCode === 13) {
                    $('.tutorial_instruction').remove();
                    $(document).off('keydown.tutorial');
                    this.continue();
                }
            }).bind(this));
        }).bind(this));
    },

    sibling: function() {
        this.instruction("Press right or left to create a sibling node");
        $(document).on('keydown.tutorial', (function(e) {
            if (e.keyCode === 37 || e.keyCode === 39) {
                $('.tutorial_instruction').remove();
                $(document).off('keydown.tutorial');
                this.instruction("Label the node and press Enter to save");
                $(document).one('keypress', (function(e){
                    if (e.keyCode === 13) {
                        this.instruction("Well done!", 400, this.continue);
                    }
                }).bind(this));
            }
        }).bind(this));
    },

    navigate: function() {
        this.instruction("The arrow keys can also be used to navigate to existing nodes", 400, function(){
            this.instruction("Navigate to the root node ('" + Syntree.Page.tree.getRoot().getLabelContent() + "')");
            $(document).on('keydown.tutorial', (function(e) {
                if (e.keyCode === 40) {
                    $(document).off('keydown.tutorial');
                    this.instruction("Good! You can press Enter or Double Click to edit the node")
                }
            }).bind(this))
        });
    }
}