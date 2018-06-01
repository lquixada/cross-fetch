var nodeFetch = require('node-fetch');
var realFetch = nodeFetch.default || nodeFetch;

var fetch = function (url, options) {
  // Support schemaless URIs on the server for parity with the browser.
  // Ex: //github.com/ -> https://github.com/
  if (/^\/\//.test(url)) {
    url = 'https:' + url;
  }
  return realFetch.call(this, url, options);
};

fetch.fetch = fetch;
// Needed for TypeScript.
fetch.default = fetch;
fetch.Response = nodeFetch.Response;
fetch.Headers = nodeFetch.Headers;
fetch.Request = nodeFetch.Request;
fetch.polyfill = false;

module.exports = fetch;
