#!/bin/sh
browser="./node_modules/.bin/mocha-headless-chrome"

npx webpack --config $(dirname "$0")/webpack.config.js &&
./bin/server --exec "$browser -f $(dirname $0)/index.html" --closeOnExec
