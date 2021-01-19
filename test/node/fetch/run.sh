#!/bin/sh
nyc="./node_modules/.bin/nyc"
mocha="./node_modules/.bin/mocha"
./test/server $nyc $mocha $(dirname "$0")/index.js
