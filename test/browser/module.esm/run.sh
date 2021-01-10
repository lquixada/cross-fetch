#!/bin/sh
npx webpack --config $(dirname "$0")/webpack.config.js &&
npx mocha-headless-chrome -f $(dirname "$0")/test.polyfill.html &&
npx mocha-headless-chrome -f $(dirname "$0")/test.ponyfill.html
