all: test lint typecheck

node_modules: package.json
	npm install && /usr/bin/touch node_modules

build:
	@echo ""
	@echo "=> make $@"
	@npx rollup -c --bundleConfigAsCjs

browser:
	@./bin/server --exec "npx open-cli http://localhost:8000/test/fetch-api/browser/"

commit:
	npx cz

commitlint: node_modules
	npx commitlint --from origin/main --to HEAD --verbose

compile: test/fetch-api/api.spec.ts
	@echo ""
	@echo "=> make $@"
	@npx tsc

cov:
	npx nyc report --reporter=text-lcov > .reports/coverage.lcov && npx codecov

lint:
	@echo ""
	@echo "=> make $@"
	@npx standard

release:
	npx standard-version

release-alpha:
	npx standard-version --prerelease alpha

secure:
	@echo ""
	@echo "=> make $@"
	@npx snyk test

test: compile test-fetch test-module

test-fetch: \
	test-fetch-browser-native \
	test-fetch-browser-whatwg \
	test-fetch-node-fetch

test-fetch-browser-native: build
	@echo ""
	@echo "=> make $@"
	@./test/fetch-api/browser/run.sh

test-fetch-browser-whatwg: build
	@echo ""
	@echo "=> make $@"
	@./test/fetch-api/whatwg/run.sh

test-fetch-node-fetch: build
	@echo ""
	@echo "=> make $@"
	@./test/fetch-api/node/run.sh

test-module: \
	test-module-web-cjs \
	test-module-web-esm \
	test-module-node-cjs \
	test-module-node-esm \
	test-module-react-native

test-module-web-cjs: build
	@echo ""
	@echo "=> make $@"
	@./test/module-system/web.cjs/run.sh

test-module-web-esm: build
	@echo ""
	@echo "=> make $@"
	@./test/module-system/web.esm/run.sh

test-module-node-cjs: build
	@echo ""
	@echo "=> make $@"
	@./test/module-system/node.cjs/run.sh

test-module-node-esm: build
	@echo ""
	@echo "=> make $@"
	@./test/module-system/node.esm/run.sh

test-module-react-native: build
	@echo ""
	@echo "=> make $@"
	@./test/module-system/react-native/run.sh

typecheck:
	@echo ""
	@echo "=> make $@"
	@npx tsc --lib ES6 --noEmit index.d.ts ./test/fetch-api/api.spec.ts

.PHONY: all build deploy lint test test-fetch test-fetch-browser-native test-fetch-browser-whatwg test-fetch-node-fetch test-module test-module-web-cjs test-module-web-esm test-module-node-cjs test-module-node-esm test-module-react-native typecheck
