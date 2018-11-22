const addSuite = require('../fetch.spec')

// Add fetch api to the global scope on node environment. The polyfill also uses
// the ponyfill version, so we're testing both aproaches in one stroke.
require('../../dist/browser-polyfill')

addSuite('bundle with polyfill')
