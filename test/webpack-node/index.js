const nock = require('nock');
const addSuites = require('../fetch.spec');
const fetch = require('../../src/node-ponyfill');

// Add fetch api to the global scope on node environment.
global.fetch = fetch;
// Specs expect fetch to be a polyfill
global.fetch.polyfill = true;
global.Request = fetch.Request;
global.Response = fetch.Response;
global.Headers = fetch.Headers;

before(() => {
  // Enable fake server
  nock('https://lquixa.da')
    .persist()
    .get('/succeed.txt')
    .reply(200, 'hello world.');

  nock('https://lquixa.da')
    .persist()
    .get('/fail.txt')
    .reply(404, 'good bye world.');
});

addSuites('webpack node bundle environment');
