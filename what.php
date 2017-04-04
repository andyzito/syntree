<!DOCTYPE html>

<html>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/head.php' ?>
    <body class="what">
        <div class="contents">
            <ul>
                <a href="#section-faq"><li>FAQ</li></a>
                <a href="#section-how-to"><li>How to...</li></a>
                <a href="#section-keys"><li>Keyboard Shortcuts</li></a>
            </ul>
        </div>
        <h2 class="title">Syntree Help</h4>
        <div id="section-faq" class="help_section help_section__faq">
            <h4>FAQ</h4>
            <ul class="faq-list">
                <li><span class="faq-q">What is Syntree?</span>
                    <p class="faq-a">Syntree is a JavaScript based web application designed to allow users to draw syntax trees digitally. It is the Division III (thesis) of Andrew Zito, a student at Hampshire college. While it is very much a work in progress at this time, it is intended to be a fully functional product within the next few months.</p></li>
                <li><span class="faq-q">What is a "syntax tree"?</span>
                    <p class="faq-a">Syntax trees are a tool used by linguists to analyze sentences. "Syntax" is distinguished from "semantics", syntax being the structure of the language (the order words placed in) and semantics being the meaning/content of the words (roughly speaking). Linguists use tree diagrams to split sentences up into parts. For example, you may have learned in elementary school about the subject, predicate, and/or object of sentences. These are ways of splitting sentences into pieces. Linguists do something similar, only with far more categories. Additionally, these categories are hierarchical and nested, meaning that the "subject", for example, can be split up into sub-categories like "article" (the, a, an) and noun. (Please bear in mind that "subject" is only an exampe here, and not a category used in actual syntax tree construction under the dominant theory).</p></li>
                <li><span class="faq-q">Can Syntree take a sentence and make a syntrax trees <em>for</em> me?</span>
                    <p class="faq-a">No. Do your own homework.</p></li>
                <li><span class="faq-q">I think this is awesomesauce/think this sucks. How can I let the creator know?</span>
                    <p class="faq-a">You can use the <a href="https://docs.google.com/forms/d/e/1FAIpQLScOwQnMioOwo0dfZXEo0DQPK-TdmMnRfYzuYS_Zf9sg-jbnkw/viewform">feedback form.</a></p></li>
            </ul>
        </div>
        <div id="section-how-to" class="help_section help_section__how-to">
            <h4>How to...</h4>
            <ul class="how-to-list">
                <li><span class="how-to-title">Select nodes:</span>
                    <p>By default you will start with a single node called "S". It will be highlighted in grey, indicating that it is the selected node. Once you have more nodes (see below), you can select them by navigating to them with the arrow keys or by clicking on them directly.</p></li>
                <li><span class="how-to-title">Make nodes:</span>
                    <p>Use arrow keys to create new nodes. Your starting point is always the currently selected node. Pressing the down arrow key will result in a new child node being create. Pressing left or right on any non-root node will result in a new sibling node. If there is already a node in the specified direction, you will navigate to that node instead of creating a new one.</p></li>
                <li><span class="how-to-title">Force a new node to be created:</span>
                    <p>Hold down CTRL and press an arrow key. Even if there is a node in that direction already, a new node will be created (directly adjacent to the selected node, in the case of creating a sibling; defaulting to the far left in the case of creating a child). Note: does not work on the up arrow key.</p></li>
                <li><span class="how-to-title">Edit nodes:</span>
                    <p>Pressing Enter will begin editing mode on the selected node. You can also double-click on any node to edit it. You will be provided with a text-box, in which you can input any node label you would like. Press Enter to save the change. If you navigate away from the node (by pressing an arrow key or clicking on another node) the node label will revert to its pre-editing state.</p></li>
                <li><span class="how-to-title">Delete nodes:</span>
                    <p>Select a node and either press the Delete key or click the small (x) button above and to the right of the selected node. This node and all of its descendants will be removed from your tree.</p></li>
                <li><span class="how-to-title">Undo actions:</span>
                    <p>If you messed up (like if you accidentally deleted half your tree, for example) never fear! Just press CTRL+Z and everything should be ok. Currently you can undo node creation, node deletion, and node edits.</p></li>
            </ul>
        </div>
        <div id="section-keys" class="help_section help_section__keyboard-shortcuts">
            <h4>Keyboard shortcuts</h4>
            <table>
                <tr>
                    <td>Down</td>
                    <td>Make a new child node / navigate to an existing child node</td>
                <tr>
                <tr>
                    <td>Left/Right</td>
                    <td>Make a sibling node / navigate to an existing sibling node</td>
                <tr>
                <tr>
                    <td>Up</td>
                    <td>Navigate to parent node</td>
                <tr>
                <tr>
                    <td>Enter</td>
                    <td>Edit / save selected node</td>
                <tr>
                <tr>
                    <td>Delete</td>
                    <td>Delete selected node and its descendants</td>
                <tr>
                <tr>
                    <td>Escape</td>
                    <td>Exit current edit, without saving changes</td>
                <tr>
                <tr>
                    <td>CTRL + arrow key</td>
                    <td>Force node creation in the specified direction (except up)</td>
                <tr>
            </table>
        </div>
    </body>
</html>