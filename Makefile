all: test lint

node_modules: package.json
	npm install && /usr/bin/touch node_modules

dist: node_modules
	npx rollup -c && /usr/bin/touch dist

test/browser/webpack/bundle.%.js: dist
	npx webpack-cli --progress --config test/browser/webpack/webpack.config.js

test/node/webpack/bundle.%.js: dist
	npx webpack-cli --progress --config test/node/webpack/webpack.config.js

build: dist

cov:
	npx nyc report --reporter=text-lcov > coverage.lcov && npx codecov

# Example make deploy release=patch
deploy:
	npm version $(release) && git push --follow-tags

lint:
	npx standard

snyk:
	npx snyk test

test: test-node test-node-webpack test-browser test-browser-webpack test-react-native

test-browser: dist
	npx mocha-headless-chrome -f test/browser/headless/index.html

test-browser-webpack: test/browser/webpack/bundle.cjs.js test/browser/webpack/bundle.esm.js
	npx mocha-headless-chrome -f test/browser/webpack/index.html

test-implementation: test-node test-browser

test-node: dist
	npx nyc mocha test/node/node/index.js

test-node-webpack: test/node/webpack/bundle.cjs.js test/node/webpack/bundle.esm.js
	npx mocha test/node/webpack/bundle.*.js

test-react-native: dist
	npx mocha test/react-native/index.js

.PHONY: all dist deploy lint test test-browser test-browser-webpack test-node test-node-webpack
