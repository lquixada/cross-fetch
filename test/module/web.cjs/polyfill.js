require('../../setup.env')
require('../../../polyfill')
const { addModuleSuite, addPolyfillSuite, addNativeSuite } = require('../module.spec')

if (/globals=off/.test(location.search)) {
  describe('Browser:Polyfill:Require:Webpack', () => {
    addModuleSuite({ fetch, Request, Response, Headers })
    addPolyfillSuite({ fetch })
  })
} else {
  describe('Browser:Native:Require:Webpack', () => {
    addModuleSuite({ fetch, Request, Response, Headers })
    addNativeSuite({ fetch })
  })
}

mocha.checkLeaks()
mocha.run()
