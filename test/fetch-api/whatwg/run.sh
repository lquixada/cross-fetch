#!/bin/sh
./bin/server --exec "npx mocha-headless-chrome -f $(dirname $0)/index.html?globals=off" --closeOnExec
