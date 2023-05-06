#!/bin/sh

source test/setup/server.sh

npx mocha-headless-chrome -f http://127.0.0.1:8000/$(dirname $0)/index.html?globals=on
