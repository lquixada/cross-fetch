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

test: test-fetch test-module

test-fetch: test-fetch-browser test-fetch-whatwg test-fetch-node

test-fetch-browser: dist
	./test/fetch/browser/run.sh

test-fetch-whatwg: dist
	./test/fetch/whatwg/run.sh

test-fetch-node: dist
	./test/fetch/node/run.sh

test-module: test-module-web-cjs test-module-web-esm test-module-node-cjs test-module-node-esm test-module-react-native

test-module-web-cjs: dist
	./test/module/web.cjs/run.sh

test-module-web-esm: dist
	./test/module/web.esm/run.sh

test-module-node-cjs: dist
	./test/module/node.cjs/run.sh

test-module-node-esm: dist
	./test/module/node.esm/run.sh

test-module-react-native: dist
	./test/module/react-native/run.sh

.PHONY: all dist deploy lint test test-fetch test-fetch-browser test-fetch-whatwg test-fetch-node test-module test-module-web-cjs test-module-web-esm test-module-node-cjs test-module-node-esm test-module-react-native
