all: test lint

node_modules: package.json
	npm install && /usr/bin/touch node_modules

dist: node_modules
	npx rollup -c && /usr/bin/touch dist

test/browser/webpack/test.%.js: dist
	npx webpack --progress --config test/browser/webpack/webpack.config.js

test/node/webpack/test.%.js: dist
	npx webpack --progress --config test/node/webpack/webpack.config.js

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

test: test-node-fetch test-node-webpack-cjs test-node-webpack-esm test-browser-fetch test-browser-webpack-cjs test-browser-webpack-esm test-react-native

test-browser-fetch: dist
	./test/browser/fetch/run.sh

test-browser-webpack-cjs:
	./test/browser/webpack.cjs/run.sh

test-browser-webpack-esm:
	./test/browser/webpack.esm/run.sh

test-node-fetch: dist
	./test/node/fetch/run.sh

test-node-webpack-cjs:
	./test/node/webpack.cjs/run.sh

test-node-webpack-esm:
	./test/node/webpack.esm/run.sh

test-react-native: dist
	./test/react-native/run.sh

.PHONY: all dist deploy lint test test-browser-fetch test-browser-webpack-cjs test-browser-webpack-esm test-node-fetch test-node-webpack-cjs test-node-webpack-esm
