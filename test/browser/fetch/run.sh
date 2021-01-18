#!/bin/sh
BROWSER="./node_modules/.bin/mocha-headless-chrome"
./test/test.server $BROWSER -a disable-web-security -f $(dirname "$0")"/index.html?globals=off" # &&
# npx mocha-headless-chrome -v -a disable-web-security -f $(dirname "$0")"/index.html?globals=on"
