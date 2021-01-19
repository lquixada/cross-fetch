#!/bin/sh
BROWSER="./node_modules/.bin/mocha-headless-chrome"

./test/server $BROWSER -f "$(dirname $0)/index.html?globals=off" &&
./test/server $BROWSER -f "$(dirname $0)/index.html?globals=on"
