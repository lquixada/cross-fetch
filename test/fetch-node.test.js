"use strict";

var expect = require('chai').expect;
var nock = require('nock');

var fetch = require('../fetch-node');
var good = 'hello world.';
var bad = 'good bye world.';

function responseToText(res) {
	if (res.status >= 400) {
		throw new Error("Bad server response");
	}

	return res.text();
}

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
