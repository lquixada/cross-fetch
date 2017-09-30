"use strict";

var fetchNode = require('../fetch-node');

fetchNode.fetch.polyfill = true;

if (!global.fetch) {
  global.fetch = fetchNode.fetch;
  global.Response = fetchNode.Response;
  global.Headers = fetchNode.Headers;
  global.Request = fetchNode.Request;
}
