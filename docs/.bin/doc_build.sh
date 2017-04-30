#!/bin/bash
if [ ! -d "./app" -o ! -d "./style" -o ! -d "./pages" ]
	then
    echo "Error! You don't seem to be in the Syntree root directory"
fi

# if [ ! type "jsdoc" > /dev/null ]
# 	then
# 	echo "Uhoh! I require jsdoc, but it isn't installed!"
# fi

# if [ ! type "rst2html5.py" > /dev/null ]
# 	then
# 	echo "Uhoh! I require sphinx, but it isn't installed!"
# fi

echo "READMEs: building"
php ./docs/.bin/build_readmes.php
echo "READMEs: built"

echo "Code reference section: building with JSDoc"
# jsdoc -r ./app --readme ./docs/.source/home.mkd -d ./docs/coderef
echo "Code reference section: built"

echo "Class diagram: building with jsdoc-parse and PlantUML"
jsdoc --template jsdoc-json --destination ./docs/.source/class_diagram/class_diagram.json app/classes/* app/singletons/*
# jsdoc2md --json --files app/classes/* app/singletons/* > ./docs/.source/class_diagram/class_diagram.json
php ./docs/.bin/build_class_diagram.php
echo "Class diagram: built"

echo "Use cases: building"
php ./docs/.bin/build_use_cases.php
echo "Use cases: built"

echo "Requirements list: building"
php ./docs/.bin/build_requirements.php
echo "Requirements list: built"