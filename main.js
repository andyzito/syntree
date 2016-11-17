H = new History();

$(document).ready(function() {
    //Snap
	snap = Snap("#workspace");

	var W = new Workspace();
	var T = W.tree;
	
	var A = T.makeChildOf(T.root,false,text="A");
	var Z = T.makeChildOf(A,false,text="Z");
	var Y = T.makeChildOf(A,false,text="Y");
	var X = T.makeChildOf(Y,false,text="X");
	var W = T.makeChildOf(Y,false,text="W");
	var B = T.makeChildOf(T.root,false,text="B");
	var C = T.makeChildOf(B,false,text="C");
	var D = T.makeChildOf(B,false,text="D");
	var E = T.makeChildOf(D,false,text="E");
	var F = T.makeChildOf(D,true,text="F");
	var M = T.makeChildOf(C,false,text="M");
	
	T.selected.save();
	
    $("#background").on('click', function(e) {
		// var wholetree = W.tree.getChildrenOf(W.tree.root,true);
		// console.log(wholetree)
        console.log(T.reposition());
        // var mouseX = e.pageX - $(this).offset().left;
        // var mouseY = e.pageY - $(this).offset().top;
        // var newnode = new Node(mouseX,mouseY,"");
        // newnode.edit();
    });
});