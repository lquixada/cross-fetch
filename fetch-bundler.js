// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)

// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');

// This IIFE prevents a bug in React-Native (https://github.com/facebook/react-native/issues/5667)
(function(self) {
	module.exports = self.fetch.bind(self);
})(typeof self !== 'undefined' ? self : this);
