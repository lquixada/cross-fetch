#!/bin/sh
./bin/server --exec "npx nyc mocha $(dirname $0)/index.js" --closeOnExec
