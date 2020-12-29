#!/bin/sh
npx nyc mocha $(dirname "$0")/index.js
