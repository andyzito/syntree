#!/bin/bash
if [ ! -d "./app" -o ! -d "./style" -o ! -d "./pages" ]
	then
    echo "Error! You don't seem to be in the Syntree root directory"
fi

README=0
CODEREF=0
CLASS=0
SQD=0
REQ=0
USE=0

if [ "$1" != "" ]
then
	if [ "$1" = "sqd" ]
	then
		SQD=1
	fi
else
	README=1
	CODEREF=1
	CLASS=1
	SQD=1
	REQ=1
	USE=1
fi

# if [ ! type "jsdoc" > /dev/null ]
# 	then
# 	echo "Uhoh! I require jsdoc, but it isn't installed!"
# fi

# if [ ! type "rst2html5.py" > /dev/null ]
# 	then
# 	echo "Uhoh! I require sphinx, but it isn't installed!"
# fi

if [ $README = 1 ]
then
	echo "READMEs: building"
	php ./docs/.bin/build_readmes.php
	echo "READMEs: built"
fi

if [ $CODEREF = 1 ]
then
	echo "Code reference section: building with JSDoc"
	jsdoc -r ./app --readme ./docs/.source/home.mkd -d ./docs/coderef
	echo "Code reference section: built"
fi

if [ $CLASS = 1 ]
then
	echo "Class diagram: building with jsdoc-json and PlantUML"
	jsdoc --template jsdoc-json --destination ./docs/.source/class_diagram/class_diagram.json app/classes/* app/singletons/*
	php ./docs/.bin/build_class_diagram.php
	java -jar ./docs/.bin/plantuml.jar ./docs/.source/class_diagram/class_diagram.plantuml
	cp ./docs/.source/class_diagram/class_diagram.png ./docs/download/class_diagram.png
	echo "Class diagram: built"
fi

if [ $SQD = 1 ]
then
	echo "Sequence diagrams: building with PlantUML"
	java -jar ./docs/.bin/plantuml.jar ./docs/.source/sequence_diagrams/*
	php ./docs/.bin/build_sequence.php
	# cp ./docs/.source/class_diagram/class_diagram.png ./docs/download/class_diagram.png
	echo "Sequence diagrams: built"
fi

if [ $USE = 1 ]
then
	echo "Use cases: building"
	php ./docs/.bin/build_use_cases.php
	echo "Use cases: built"
fi

if [ $REQ = 1 ]
then
	echo "Requirements list: building"
	php ./docs/.bin/build_requirements.php
	echo "Requirements list: built"
fi