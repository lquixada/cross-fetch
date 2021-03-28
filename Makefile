all: test lint typecheck

node_modules: package.json
	npm install && /usr/bin/touch node_modules

build: build-dist build-test

build-dist:
	npx rollup -c

build-test: test/fetch/api.spec.js
	npx tsc

commitlint: node_modules
	npx commitlint --from origin/main --to HEAD --verbose

cov:
	npx nyc report --reporter=text-lcov > .reports/coverage.lcov && npx codecov

lint:
	npx standard

release:
	npx standard-version

release-alpha:
	npx standard-version --prerelease alpha

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

typecheck:
	npx tsc --lib ES6 --noEmit index.d.ts ./test/fetch/api.spec.ts

.PHONY: all build deploy lint test test-fetch test-fetch-browser test-fetch-whatwg test-fetch-node test-module test-module-web-cjs test-module-web-esm test-module-node-cjs test-module-node-esm test-module-react-native typecheck
