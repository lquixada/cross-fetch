#!/bin/sh
npx webpack --config $(dirname "$0")/webpack.config.js &&
npx mocha $(dirname "$0")/test.*.js
