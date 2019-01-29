all: test

node_modules/:
	npm install

build: node_modules
	npx rollup -c

build-browser-webpack: build
	npx webpack-cli --progress --config test/browser/webpack/webpack.config.js

build-node-webpack: build
	npx webpack-cli --progress --config test/node/webpack/webpack.config.js

cov:
	npx nyc report --reporter=text-lcov > coverage.lcov && npx codecov

# Example make deploy release=patch
deploy:
	npm version $(release) && git push --follow-tags

lint:
	npx standard

sauce:
	./tasks/sauce

snyk:
	npx snyk test

test: test-node test-node-webpack test-browser test-browser-webpack test-react-native lint

test-browser: build
	npx mocha-headless-chrome -f test/browser/headless/index.html

test-browser-webpack: build build-browser-webpack
	npx mocha-headless-chrome -f test/browser/webpack/index.html

test-implementation: test-node test-browser

test-node: build
	npx nyc mocha test/node/node/index.js

test-node-webpack: build build-node-webpack
	npx mocha test/node/webpack/bundle.*.js

test-react-native: build
	npx mocha test/react-native/index.js

.PHONY: all build build-browser-webpack build-node-webpack deploy lint test test-browser test-browser-webpack test-node test-node-webpack  sauce
