var fetchNode = require('./node-ponyfill');
var fetch = fetchNode.fetch.bind({});

fetch.polyfill = true;
console.log('this is a test');
if (!global.fetch) {
  global.fetch = fetch;
  global.Response = fetchNode.Response;
  global.Headers = fetchNode.Headers;
  global.Request = fetchNode.Request;
}

