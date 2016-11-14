H = new History();

$(document).ready(function() {
    //Snap
	snap = Snap("#workspace");

	var W = new Workspace();

    $("#background").on('click', function(e) {
        console.log(W.tree.getChildrenOf(W.tree.root,true));
        // var mouseX = e.pageX - $(this).offset().left;
        // var mouseY = e.pageY - $(this).offset().top;
        // var newnode = new Node(mouseX,mouseY,"");
        // newnode.edit();
    });
});