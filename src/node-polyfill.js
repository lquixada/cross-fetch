if (!global.fetch) {
  var fetchNode = require('./node-ponyfill')
  var fetch = fetchNode.fetch.bind({})

  fetch.polyfill = true
  
  global.fetch = fetch
  global.Response = fetchNode.Response
  global.Headers = fetchNode.Headers
  global.Request = fetchNode.Request
}
