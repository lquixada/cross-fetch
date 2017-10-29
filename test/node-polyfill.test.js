"use strict";

require('../src/node-polyfill');

var expect = require('chai').expect;
var nock = require('nock');

var good = 'hello world.';
var bad = 'good bye world.';

function responseToText(res) {
	if (res.status >= 400) {
		throw new Error("Bad server response");
	}

	return res.text();
}

describe('polyfill', function () {

  describe('fetch', function () {
    before(function () {
      nock('https://lquixa.da')
        .get('/succeed.txt')
        .reply(200, good);

      nock('https://lquixa.da')
        .get('/fail.txt')
        .reply(404, bad);
    });

    it('should be defined', function () {
      expect(fetch).to.be.a('function');
    });

    it('should be a polyfill', function () {
      expect(fetch.polyfill).to.be.true;
    });

    it('should facilitate the making of requests', function () {
      return fetch('//lquixa.da/succeed.txt')
        .then(responseToText)
        .then(function (data) {
          expect(data).to.equal(good);
        });
    });

    it('should do the right thing with bad requests', function () {
      return fetch('//lquixa.da/fail.txt')
        .then(responseToText)
        .catch(function (err) {
          expect(err.toString()).to.equal("Error: Bad server response");
        });
    });
  });

  describe('Request', function () {
    it('should be defined', function () {
      expect(Request).to.be.a('function');
    });

    it('should define GET as default method', function () {
      var request = new Request('//lquixa.da/');
      expect(request.method).to.equal('GET');
    });
  });

  describe('Response', function () {
    it('should be defined', function () {
      expect(Response).to.be.a('function');
    });

    it('should be ok :)', function () {
      var response = new Response();
      expect(response.ok).to.be.ok;
    });
  });

  describe('Headers', function () {
    it('should be defined', function () {
      expect(Headers).to.be.a('function');
    });

    it('should set a header', function () {
      var headers = new Headers({'X-Custom': 'foo'});
      expect(headers.get('X-Custom')).to.equal('foo');
    });
  });
});
