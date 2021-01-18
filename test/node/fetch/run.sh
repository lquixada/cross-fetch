#!/bin/sh
./test/test.server npx nyc mocha $(dirname "$0")/index.js
