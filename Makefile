.PHONY: all
all: test lint typecheck

.PHONY: browser
browser:
	@./bin/server --exec "npx open-cli http://127.0.0.1:8000/test/fetch-api/browser/"

.PHONY: commit
commit:
	npx cz

.PHONY: release
release:
	npx standard-version

.PHONY: release-alpha
release-alpha:
	npx standard-version --prerelease alpha


##
# Builds

node_modules: package.json
	npm install && /usr/bin/touch node_modules

dist: package.json rollup.config.js $(wildcard src/*.js) node_modules
	@echo ""
	@echo "=> make $@"
	@npx rollup -c --bundleConfigAsCjs && /usr/bin/touch dist

test/fetch-api/api.spec.js: test/fetch-api/api.spec.ts
	@echo ""
	@echo "=> make $@"
	@npx tsc


##
# Checks

.PHONY: commitlint
commitlint: node_modules
	npx commitlint --from origin/main --to HEAD --verbose

.PHONY: cov
cov:
	npx nyc report --reporter=text-lcov > .reports/coverage.lcov && npx codecov

.PHONY: lint
lint:
	@echo ""
	@echo "=> make $@"
	@npx standard

.PHONY: secure
secure:
	@echo ""
	@echo "=> make $@"
	@npx snyk test

.PHONY: typecheck
typecheck:
	@echo ""
	@echo "=> make $@"
	@npx tsc --lib ES6 --noEmit index.d.ts ./test/fetch-api/api.spec.ts


##
# Test groups

.PHONY: test
test: test-browser test-node

.PHONY: test-browser
test-browser: \
	test-fetch-browser-native \
	test-fetch-browser-whatwg \
	test-module-web-cjs \
	test-module-web-esm \
	test-module-react-native

.PHONY: test-node
test-node: \
	test-fetch-node-native \
	test-fetch-node-fetch \
	test-module-node-cjs \
	test-module-node-esm


##
# Test units

.PHONY: test-fetch-browser-native
test-fetch-browser-native: dist test/fetch-api/api.spec.js
	@echo ""
	@echo "=> make $@"
	@./test/fetch-api/browser/run.sh

.PHONY: test-fetch-browser-whatwg
test-fetch-browser-whatwg: dist test/fetch-api/api.spec.js
	@echo ""
	@echo "=> make $@"
	@./test/fetch-api/whatwg/run.sh

.PHONY: test-fetch-node-native
test-fetch-node-native: dist test/fetch-api/api.spec.js
	@echo ""
	@echo "=> make $@"
	@./test/fetch-api/node/run.sh

.PHONY: test-fetch-node-fetch
test-fetch-node-fetch: dist test/fetch-api/api.spec.js
	@echo ""
	@echo "=> make $@"
	@./test/fetch-api/node-fetch/run.sh

.PHONY: test-module-web-cjs
test-module-web-cjs: dist
	@echo ""
	@echo "=> make $@"
	@./test/module-system/web.cjs/run.sh

.PHONY: test-module-web-esm
test-module-web-esm: dist
	@echo ""
	@echo "=> make $@"
	@./test/module-system/web.esm/run.sh

.PHONY: test-module-node-cjs
test-module-node-cjs: dist
	@echo ""
	@echo "=> make $@"
	@./test/module-system/node.cjs/run.sh

.PHONY: test-module-node-esm
test-module-node-esm: dist
	@echo ""
	@echo "=> make $@"
	@./test/module-system/node.esm/run.sh

.PHONY: test-module-react-native
test-module-react-native: dist
	@echo ""
	@echo "=> make $@"
	@./test/module-system/react-native/run.sh
