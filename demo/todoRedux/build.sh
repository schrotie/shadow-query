#!/bin/sh

OUT=build/index.html
SRC=src/app.mjs
BUNDLE=build/src/bundle.js
BABELED=build/src/babeled.js
UGLY=build/src/app.js
BIN=./node_modules/.bin

rm -rf build

$BIN/rollup   --format iife                        $SRC --file $BUNDLE
$BIN/babel                                         $BUNDLE   > $BABELED
$BIN/uglifyjs --mangle --compress --keep-fnames -- $BABELED  > $UGLY

# insert built results into HTML
cp index.html $OUT
sed -i -e 's/<script type="module" src="src\/app.mjs">/<script>\n/' $OUT
sed -i -e "/<script>/ r $UGLY" $OUT
