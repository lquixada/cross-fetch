const nock = require('nock');
const { expect } = require('chai');

global.expect = expect;

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
