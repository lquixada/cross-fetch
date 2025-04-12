#!/bin/sh
npx webpack --config $(dirname "$0")/webpack.config.js &&
npx mocha-headless-chrome -f $(dirname "$0")/polyfill.html?globals=off -a no-sandbox -a disable-setuid-sandbox &&
npx mocha-headless-chrome -f $(dirname "$0")/polyfill.html?globals=on -a no-sandbox -a disable-setuid-sandbox &&
npx mocha-headless-chrome -f $(dirname "$0")/ponyfill.html?globals=off -a no-sandbox -a disable-setuid-sandbox &&
npx mocha-headless-chrome -f $(dirname "$0")/ponyfill.html?globals=on -a no-sandbox -a disable-setuid-sandbox

