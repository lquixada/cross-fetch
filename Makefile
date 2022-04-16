all: test lint typecheck

node_modules: package.json
	npm install && /usr/bin/touch node_modules

build:
	npx rollup -c

browser:
	./bin/server --exec "npx open-cli http://localhost:8000/test/fetch-api/browser/"

commitlint: node_modules
	npx commitlint --from origin/main --to HEAD --verbose

compile: test/fetch-api/api.spec.ts
	npx tsc

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

test: compile test-fetch test-module

test-fetch: test-fetch-browser test-fetch-whatwg test-fetch-node

test-fetch-browser: build
	./test/fetch-api/browser/run.sh

test-fetch-whatwg: build
	./test/fetch-api/whatwg/run.sh

test-fetch-node: build
	./test/fetch-api/node/run.sh

test-module: test-module-web-cjs test-module-web-esm test-module-node-cjs test-module-node-esm test-module-react-native

test-module-web-cjs: build
	./test/module-system/web.cjs/run.sh

test-module-web-esm: build
	./test/module-system/web.esm/run.sh

test-module-node-cjs: build
	./test/module-system/node.cjs/run.sh

test-module-node-esm: build
	./test/module-system/node.esm/run.sh

test-module-react-native: build
	./test/module-system/react-native/run.sh

typecheck:
	npx tsc --lib ES6 --noEmit index.d.ts ./test/fetch-api/api.spec.ts

.PHONY: all build deploy lint test test-fetch test-fetch-browser test-fetch-whatwg test-fetch-node test-module test-module-web-cjs test-module-web-esm test-module-node-cjs test-module-node-esm test-module-react-native typecheck
