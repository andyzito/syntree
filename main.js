H = new History();

$(document).ready(function() {
    //Snap
	snap = Snap("#workspace");

	var W = new Workspace();

    $("#background").on('click', function(e) {
		var wholetree = W.tree.getChildrenOf(W.tree.root,true);
		// console.log(wholetree)
        console.log(W.tree.getNodesByOffset(wholetree,1));
        // var mouseX = e.pageX - $(this).offset().left;
        // var mouseY = e.pageY - $(this).offset().top;
        // var newnode = new Node(mouseX,mouseY,"");
        // newnode.edit();
    });
});