#!/bin/sh
BROWSER="./node_modules/.bin/mocha-headless-chrome"
URL="http://localhost:8000/$(dirname $0)/index.html"

./test/test.server $BROWSER -f "$URL?globals=off" &&
./test/test.server $BROWSER -f "$URL?globals=on"
