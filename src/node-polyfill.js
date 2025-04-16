if (!global.fetch) {
  const fetchNode = require('./node-ponyfill')
  const fetch = fetchNode.fetch.bind({})

  global.fetch = fetch
  global.fetch.polyfill = true
  global.Response = fetchNode.Response
  global.Headers = fetchNode.Headers
  global.Request = fetchNode.Request
}
