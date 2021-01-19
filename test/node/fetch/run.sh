#!/bin/sh
./test/server npx nyc mocha $(dirname "$0")/index.js
