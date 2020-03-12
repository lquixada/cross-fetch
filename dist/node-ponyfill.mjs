import nodeFetch from 'node-fetch'
var realFetch = nodeFetch.default || nodeFetch

var fetch = function (url, options) {
  // Support schemaless URIs on the server for parity with the browser.
  // Ex: //github.com/ -> https://github.com/
  if (/^\/\//.test(url)) {
    url = 'https:' + url
  }
  return realFetch.call(this, url, options)
}

export default fetch

export { fetch }
export const Headers = nodeFetch.Headers
export const Request = nodeFetch.Request
export const Response = nodeFetch.Response
