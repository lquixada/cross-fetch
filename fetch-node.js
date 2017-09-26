"use strict";

var fetch = require('node-fetch');

module.exports = function(url, options) {
  // Support schemaless URIs on the server for parity with the browser.
  // Ex: //github.com/ is converted to https://github.com/
  // https://github.com/matthew-andrews/isomorphic-fetch/pull/10
	if (/^\/\//.test(url)) {
		url = 'https:' + url;
  }

	return fetch.call(this, url, options);
};
