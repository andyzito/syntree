<div id="workspace_container">
	<div class="modal modal_body modal_export">
		<p class="modal modal_title modal_title_main modal_export">Export</p>
		<div class="modal modal_section modal_section__filetype">
			<p class="modal modal_title modal_section_title modal_section_title__filetype modal_export">Filetype</p>
			<label class="modal modal_label modal_label_radio modal_export">
				<input type="radio" name="filetype"  checked="checked">
				Text (bracket notation)
			</label><br>
			<label class="modal modal_label modal_label_radio modal_export">
				<input type="radio" name="filetype">
				PNG
			</label>
		</div>
		<div class="modal modal_section modal_section__subtree">
			<p class="modal modal_title modal_section_title modal_section_title__subtree modal_export">Subtree</p>
			<label class="modal modal_label modal_label_radio modal_export">
				<input type="radio" name="subtree" checked="checked">
				From root node
			</label><br>
			<label class="modal modal_label modal_label_radio modal_export">
				<input type="radio" name="subtree">
				From currently selected node
			</label>
		</div>
		<div class="modal modal_buttonset">
			<button class="modal modal_button modal_button__export">Export</button>
			<button class="modal modal_button modal_button__cancel">Cancel</button>
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