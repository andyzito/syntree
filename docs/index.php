<!DOCTYPE html>

<html>
    <?php include $_SERVER['DOCUMENT_ROOT'] . '/head.php' ?>
    <script>
    jQuery(document).ready(function(){
        jQuery(document).on('click', '.sub_menu', function(){
            jQuery(this).toggleClass('expanded');
        });
    });
    </script>

    <body class="page_docs page_doc_index">

    <h1 class="page_title">Syntree Docs</h1>

    <div class="block_menu">
        <ul>
        <a href="/"><li>Home</li></a>
        <a href="/pages/app-page.php"><li>Make A Tree</li></a>
        <a href="/docs/coderef"><li>Code Reference</li></a>
        <li class="sub_menu" tabindex="1">Software Engineering
            <ul>
            <a href="/docs/requirements_list.php"><li>Requirements List</li></a>
            <a href="/docs/use_cases.php"><li>Use Cases</li></a>
            <a href="/docs/class_diagram.php"><li>Class Diagram</li></a>
            <a href="/docs/sequence_diagrams.php"><li>Sequence Diagrams</li></a>
            </ul>
        </li>
        <a href="/pages/what.php"><li>End User Help</li></a>
        <a href="https://docs.google.com/document/d/1abIMp6Gu2lyyBcFk5mZkK9pgUukrXH86ZqzLBI4HuRc/edit?usp=sharing"><li>Write Up & Retrospective</li></a>
        </ul>
    </div>

    <div class="blurb">

        <h3 class="title blurb_title">A Word (Several Words) on Documentation</h3>

    <p>
    I have submitted three different forms of documentation accompanying the source code and implementation of Syntree.

    The first form is user targeted. It includes the FAQ & Help page of the Syntree website. User targeted documentation is intended for end users, and assumes only basic computer literacy. It does not contain documentation of the inner workings of the code, as it is assumed end users will not be interested in, nor assisted by, this information (at least, not in their capacity as end users). User targeted documentation is meant to be easily digestible and goal-focused -- that is, it should be geared towards assisting a user in completing certain tasks, these tasks being component tasks of the overall goal of drawing a tree. (For example, creating a node, drawing a movement arrow).

    The second form of documentation is developer targeted. It includes the README.rst files in some directories of the source code, as well as the JSDoc code docs. Developer targeted documentation is intended for those who wish to understand the inner workings of Syntree, or who wish to extend its functionality. It does not go into detail about how to accomplish end user tasks, nor about the purpose of Syntree as an application. It does go into detail about the structure and nature of the source code. The README files contain mostly information on the directory structure and identity of PHP and other files which make up the Syntree website, but do not contain detail on the objects, classes, methods, etc. which make up the application itself. This type of information can be found in the JSDoc generated code documentation. Developer targeted documentation is meant to be both goal-focused and asynchronously accessible -- that is, it should offer suggestions for potential developer tasks like creating a new type of graphical element, but should also provide extensive support for a developer searching for information on a specific entity (for example, the “select” function of the “ElementsManager” class).

    The third form of documentation is targeted largely towards the committee evaluating this project. It is the kind of documentation described by software engineering textbooks, and includes a class diagram, various sequence diagrams, a requirements list, several class and method analyses, and many use cases. This documentation is intended first and foremost as a demonstration of the creator’s ability to produce standards-compliant, organized, useful software engineering documentation. However, it will also be included with the developer targeted documentation, as it may aid any third party interested in understanding the structure of the application.</p></div>

    </body>
</html>