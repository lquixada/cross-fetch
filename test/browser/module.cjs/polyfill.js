require('../setup.env')
require('../../../polyfill')
const { addModuleSuite, addPolyfillSuite } = require('../../module.spec')

describe('Browser: require polyfill on Webpack bundle', () => {
  addModuleSuite({ fetch, Request, Response, Headers })
  addPolyfillSuite({ fetch })
})

mocha.checkLeaks()
mocha.run()
