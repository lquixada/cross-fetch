all: test lint

node_modules: package.json
	npm install && /usr/bin/touch node_modules

build: node_modules
	npx rollup -c && /usr/bin/touch dist

cov:
	npx nyc report --reporter=text-lcov > .reports/coverage.lcov && npx codecov

# Example make deploy release=patch
deploy:
	npm version $(release) && git push --follow-tags

lint:
	npx standard

secure:
	npx snyk test

test: test-fetch test-module

test-fetch: test-fetch-browser test-fetch-whatwg test-fetch-node

test-fetch-browser: build
	./test/fetch/browser/run.sh

test-fetch-whatwg: build
	./test/fetch/whatwg/run.sh

test-fetch-node: build
	./test/fetch/node/run.sh

test-module: test-module-web-cjs test-module-web-esm test-module-node-cjs test-module-node-esm test-module-react-native

test-module-web-cjs: build
	./test/module/web.cjs/run.sh

test-module-web-esm: build
	./test/module/web.esm/run.sh

test-module-node-cjs: build
	./test/module/node.cjs/run.sh

test-module-node-esm: build
	./test/module/node.esm/run.sh

test-module-react-native: build
	./test/module/react-native/run.sh

.PHONY: all build deploy lint test test-fetch test-fetch-browser test-fetch-whatwg test-fetch-node test-module test-module-web-cjs test-module-web-esm test-module-node-cjs test-module-node-esm test-module-react-native
