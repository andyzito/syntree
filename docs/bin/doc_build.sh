#!/bin/bash
if [ ! -d "./app" -o ! -d "./style" -o ! -d "./pages" ]
	then
    echo "Error! You don't seem to be in the Syntree root directory"
fi

README=0
CODEREF=0
CLASSD=0
CLASSA=0
SQD=0
REQ=0
USE=0

if [ "$1" != "" ]
then
	if [ "$1" = "sqd" ]
	then
		SQD=1
	elif [ "$1" = "readme" ]
		then
		README=1
	elif [ "$1" = "coderef" ]
		then
		CODEREF=1
	elif [ "$1" = "class-diagram" ]
		then
		CLASSD=1
	elif [ "$1" = "req" ]
		then
		REQ=1
	elif [ "$1" = "use" ]
		then
		USE=1
	elif [ "$1" = "class-analyses" ]
		then
		CLASSA=1
	fi
else
	README=1
	CODEREF=1
	CLASSD=1
	CLASSA=1
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
	echo "READMEs..."
	php ./docs/bin/build_readmes.php
fi

if [ $CODEREF = 1 ]
then
	echo "Code reference section..."
	php ./docs/bin/build_coderef.php
fi

if [ $CLASSD = 1 ]
then
	echo "Class diagram..."
	jsdoc --template jsdoc-json --destination ./docs/source/base/class_diagram/class_diagram.json app/classes/* app/singletons/*
	php ./docs/bin/build_class_diagram.php
	java -jar ./docs/bin/plantuml.jar ./docs/source/base/class_diagram/class_diagram.plantuml
	cp ./docs/source/base/class_diagram/class_diagram.png ./docs/download/class_diagram.png
fi

if [ $SQD = 1 ]
then
	echo "Sequence diagrams..."
	java -jar ./docs/bin/plantuml.jar ./docs/source/base/sequence_diagrams/*
	php ./docs/bin/build_sequence.php
fi

if [ $USE = 1 ]
then
	echo "Use cases..."
	php ./docs/bin/build_use_cases.php
fi

if [ $REQ = 1 ]
then
	echo "Requirements list..."
	php ./docs/bin/build_requirements.php
fi

if [ $CLASSA = 1 ]
then
	echo "Class/method analyses..."
	php ./docs/bin/build_analyses.php
fi

echo "All done!"