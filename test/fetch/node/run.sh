#!/bin/sh
nyc="./node_modules/.bin/nyc"
mocha="./node_modules/.bin/mocha"
./bin/server --exec "$nyc $mocha $(dirname $0)/index.js"
