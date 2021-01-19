#!/bin/sh
NYC="./node_modules/.bin/nyc"
MOCHA="./node_modules/.bin/mocha"
./test/server $NYC $MOCHA $(dirname "$0")/index.js
