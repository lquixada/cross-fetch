require('../../../polyfill')

const { addModuleSuite, addPolyfillSuite } = require('../../module.spec')

describe('Node:Polyfill:Require:Webpack', () => {
  addModuleSuite({ fetch, Request, Response, Headers })
  addPolyfillSuite({ fetch })
})
