#!/bin/sh
browser="./node_modules/.bin/mocha-headless-chrome"
./test/server $browser -f "$(dirname $0)/index.html?globals=off" &&
./test/server $browser -f "$(dirname $0)/index.html?globals=on"
