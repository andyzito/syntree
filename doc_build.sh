#!/bin/bash
if [ ! -d "./app" -o ! -d "./style" -o ! -d "./pages" ] then
    echo "Error! You don't seem to be in the Syntree root directory"
fi

if [ ! -f "./docs/se/use_cases/use_cases_source.html" ] touch ./docs/se/use_cases/use_cases_source.html fi
jsdoc -r ./app -d ./docs/coderef
php build_readmes.php
php build_se.php
 
