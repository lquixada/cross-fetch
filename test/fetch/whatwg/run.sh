#!/bin/sh
browser="./node_modules/.bin/mocha-headless-chrome"
./bin/server --exec "$browser -f $(dirname $0)/index.html?globals=off"
