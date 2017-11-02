const { expect } = require('chai');
const nock = require('nock');

const fetch = require('../src/node');
const { Request, Response, Headers } = require('../src/node');
const good = 'hello world.';
const bad = 'good bye world.';

const responseToText = (res) => {
	if (res.status >= 400) {
		throw new Error('Bad server response');
	}

	return res.text();
};

describe('ponyfill', () => {

  describe('fetch', () => {
    before(() => {
      nock('https://lquixa.da')
        .get('/succeed.txt')
        .reply(200, good);

      nock('https://lquixa.da')
        .get('/fail.txt')
        .reply(404, bad);
    });

    it('should be defined', () => {
      expect(fetch).to.be.a('function');
    });

    it('should not be a polyfill', () => {
      expect(fetch.polyfill).to.not.be.true;
    });

    it('should facilitate the making of requests', () => {
      return fetch('//lquixa.da/succeed.txt')
        .then(responseToText)
        .then(function (data) {
          expect(data).to.equal(good);
        });
    });

    it('should do the right thing with bad requests', () => {
      return fetch('//lquixa.da/fail.txt')
        .then(responseToText)
        .catch(function (err) {
          expect(err.toString()).to.equal("Error: Bad server response");
        });
    });
  });

  describe('Request', () => {
    it('should be defined', () => {
      expect(Request).to.be.a('function');
    });

    it('should define GET as default method', () => {
      const request = new Request('//lquixa.da/');
      expect(request.method).to.equal('GET');
    });
  });

  describe('Response', () => {
    it('should be defined', () => {
      expect(Response).to.be.a('function');
    });

    it('should be ok :)', () => {
      const response = new Response();
      expect(response.ok).to.be.ok;
    });
  });

  describe('Headers', () => {
    it('should be defined', () => {
      expect(Headers).to.be.a('function');
    });

    it('should set a header', () => {
      const headers = new Headers({'X-Custom': 'foo'});
      expect(headers.get('X-Custom')).to.equal('foo');
    });
  });
});
