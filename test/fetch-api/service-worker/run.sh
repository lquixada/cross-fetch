#!/bin/sh

. test/setup/server.sh

npx webpack --config $(dirname "$0")/webpack.config.js &&
npx mocha-headless-chrome -f http://127.0.0.1:8000/$(dirname $0)/index.html -a no-sandbox -a disable-setuid-sandbox

