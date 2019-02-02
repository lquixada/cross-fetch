all: ios

node_modules: package.json
	npm install && /usr/bin/touch node_modules

%/bundle.js: node_modules
	npx webpack-cli

build-native: node_modules
	node node_modules/react-native/local-cli/cli.js start

node-bundle: node/bundle.js
	node node/bundle

node-plain: node_modules
	node github

headless: web/bundle.js
	node web/puppeteer

android: node_modules
	npx react-native run-android

ios: node_modules
	npx react-native run-ios

.PHONY: all android ios headless node-plain node-bundle build build-native
