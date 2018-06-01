const nock = require('nock');
const addSuite = require('../fetch.spec');

// Add fetch api to the global scope on node environment. The polyfill also uses
// the ponyfill version, so we're testing both aproaches in one stroke.
require('../../src/node-polyfill');

before(() => {
  nock('https://lquixa.da')
    .persist()
    .get('/succeed.txt')
    .reply(200, 'hello world.');

  nock('https://lquixa.da')
    .persist()
    .get('/fail.txt')
    .reply(404, 'good bye world.');
});

addSuite('Environment: NODE');
