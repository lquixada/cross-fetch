require('../setup.server')
require('../../../polyfill')

const { addModuleSuite, addPolyfillSuite } = require('../../module.spec')

describe('Node: require polyfill on Webpack bundle', () => {
  addModuleSuite({ fetch, Request, Response, Headers })
  addPolyfillSuite({ fetch })
})
