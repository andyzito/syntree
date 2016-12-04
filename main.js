H = new History();

$(document).ready(function() {
    //Snap
	snap = Snap("#workspace");

	var W = new Workspace();
	var T = W.page.tree;
	W.page.selectNode(T.root);
	// T.root.select();
	
	// var DP = T.makeChildOf(T.root,false,"NP");
	// var D = T.makeChildOf(DP,false,"D");
	// var The = T.makeChildOf(D,false,"The");
	
	// var AP = T.makeChildOf(DP,false,"AP");
	// var A = T.makeChildOf(AP, false, "A");
	// T.makeChildOf(A,false,"purple");
	// var AP = T.makeChildOf(AP,false,"AP");
	// var A = T.makeChildOf(AP,false,"A");
	// T.makeChildOf(A,false,"space");
	
	// var NP = T.makeChildOf(AP,false,"NP");
	// var N = T.makeChildOf(NP,false,"N");
	// var cat = T.makeChildOf(N,false,"cat");
	
	// var VP = T.makeChildOf(T.root,false,"VP");
	// var V = T.makeChildOf(VP,false,"V");
	// var is = T.makeChildOf(V,false,"is");
	// var PP = T.makeChildOf(VP,false,"PP");
	// var P = T.makeChildOf(PP,false,"P");
	// var p = T.makeChildOf(P,false,"on top of");
	// var DP = T.makeChildOf(PP,false,"DP");
	// var D = T.makeChildOf(DP,false,"D");
	// var the = T.makeChildOf(D,false,"the");
	// var AP = T.makeChildOf(DP,false,"AP");
	// var A = T.makeChildOf(AP,false,"A");
	// var blue = T.makeChildOf(A,false,"blue");
	// var NP = T.makeChildOf(AP,false,"NP");
	// var N = T.makeChildOf(NP,false,"N");
	// var fire = T.makeChildOf(N,false,"fireman");
	
	var A = T.makeChildOf(T.root,false,text="A");
	// var Z = T.makeChildOf(A,false,text="Z");
	// var Y = T.makeChildOf(A,false,text="Y");
	// var X = T.makeChildOf(Y,false,text="X");
	// var W = T.makeChildOf(Y,false,text="W");
	var B = T.makeChildOf(T.root,false,text="B");
	// var C = T.makeChildOf(B,false,text="C");
	// var D = T.makeChildOf(B,false,text="D");
	// var E = T.makeChildOf(D,false,text="E");
	// var F = T.makeChildOf(D,true,text="F");
	// var M = T.makeChildOf(C,false,text="M");
	// var Q = T.makeChildOf(C,false,text="Q");
	// var G = T.makeChildOf(W,false,text="G");
	// var H = T.makeChildOf(W,false,text="H");
	// var I = T.makeChildOf(M,false,text="I");
	// var J = T.makeChildOf(M,false,text="J");
	// var K = T.makeChildOf(F,false,text="K");
	// var L = T.makeChildOf(F,false,text="L");
	
	// T.selected.save();
	
    $("#background").on('click', function(e) {
		T.getPath('both');
    });
});