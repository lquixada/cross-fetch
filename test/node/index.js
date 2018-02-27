// Prepare environment
require('./setup');

// Add fetch api to the global scope on node environment. The polyfill also uses
// the ponyfill version, so we're testing both aproaches in one stroke.
require('../../src/node-polyfill');

// Run suite with that
require('../fetch.spec')('node environment');
