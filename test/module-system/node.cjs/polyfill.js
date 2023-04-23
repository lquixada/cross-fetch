// Delete node's native fetch api to force the polyfill installation for testing purposes
delete global.fetch
delete global.Request
delete global.Response
delete global.Headers

require('../../../polyfill')

const { addModuleSuite, addPolyfillSuite } = require('../module.spec')

describe('Node:Polyfill:Require:Webpack', () => {
  addModuleSuite({ fetch, Request, Response, Headers })
  addPolyfillSuite({ fetch })
})
