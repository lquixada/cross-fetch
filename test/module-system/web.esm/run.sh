#!/bin/sh
npx webpack --config $(dirname "$0")/webpack.config.js &&
npx mocha-headless-chrome -f $(dirname "$0")/test.polyfill.html?globals=off &&
npx mocha-headless-chrome -f $(dirname "$0")/test.polyfill.html?globals=on &&
npx mocha-headless-chrome -f $(dirname "$0")/test.ponyfill.html?globals=off &&
npx mocha-headless-chrome -f $(dirname "$0")/test.ponyfill.html?globals=on
