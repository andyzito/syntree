var tutorial = {
    order: [
        'start',
        'down',
        'label',
        'sibling',
    ],
    index: -1,
    running: false,

    run: function(name) {
        eval("this." + name + '()');
    },

    continue: function() {
        this.index += 1;
        if (this.index >= this.order.length) {
            this.quit();
            return;
        }
        this.run(this.order[this.index]);
    },

    quit: function() {
        this.index = Infinity;
        this.running = false;
    },

    instruction: function(text, duration, complete) {
        $("#workspace_container").append('<p class="tutorial_instruction">' + text + '</p>');
        if (typeof duration !== 'undefined') {
            $('.tutorial_instruction').fadeOut(duration, (function() {
                $('.tutorial_instruction').remove();
                complete.call(this);
            }).bind(this));
        }
    },

    start: function() {
        modal_close('app');
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
}