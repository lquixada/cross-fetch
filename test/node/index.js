const runSuite = require('../fetch.spec');

// Add fetch api to the global scope on node environment
require('../../src/node-polyfill');

// Run suite with that
runSuite('node environment');
