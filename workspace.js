function Workspace() {
	this.svg = $("#workspace");
	this.background = snap.rect(0,0,this.svg.width(),this.svg.height());
	this.background.attr({fill:'white',id:'background'});
	this.tree = new Tree(this.svg.width()/2,20);
	
	var tree = this.tree;
	
	$(document).on('click', '.node-label', function(){
		tree.eventNodeClick(this);
	});
	
	$(document).on('keydown', function(e) {
		if (e.keyCode === 13) {
			tree.eventEnter();
		} else if (e.keyCode === 37) {
			tree.eventLeft();
		} else if (e.keyCode === 38) {
			tree.eventUp();
		} else if (e.keyCode === 39) {
			tree.eventRight();
		} else if (e.keyCode === 40) {
			tree.eventDown();
		}
	})
}
