#!/bin/sh
npx mocha-headless-chrome -f $(dirname "$0")/index.html
