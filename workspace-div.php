<div id="workspace_container">
	<div class="modal_body modal_export">
		<p class="modal_title modal_title__main">Export</p>
		<div class="modal_section modal_section__filetype">
			<p class="modal_title modal_title_section">Filetype</p>
			<span class="modal_option modal_option__bracket-file">
				<label class="modal_label">
					<input type="radio" name="filetype" value="bracket-file" checked="checked">
					Bracket notation (text file)
				</label>
			</span></br>
			<span class="modal_option modal_option__png">
				<label class="modal_label">
					<input type="radio" name="filetype" value="png">
					PNG
				</label>
			</span></br>
			<span class="modal_option modal_option__fname">
				<input type="text" value="mytree"><span>.txt</span>
			</span>
		</div>
		<div class="modal_section modal_section__subtree">
			<p class="modal_title modal_title_section">Subtree</p>
			<label class="modal_label modal_label_option modal_label_option__from-root">
				<input type="radio" name="subtree" checked="checked">
				From root node
			</label><br>
			<label class="modal_label modal_label_option modal_label_option__from-curr">
				<input type="radio" name="subtree">
				From currently selected node
			</label>
		</div>
		<div class="modal_section modal_section__buttonset">
			<button class="modal_button modal_button__export">Export</button>
			<button class="modal_button modal_button__cancel">Cancel</button>
		</div>
	</div>
	<div id="overlay">
	</div>
	<ul id="toolbar">
		<li class="toolbar_button toolbar_button__export">Save/export</li>
		<li class="toolbar_button">Upload/import</li>
	</ul>
	<svg id="workspace" width="100%" height="100%">
	</svg>
</div>