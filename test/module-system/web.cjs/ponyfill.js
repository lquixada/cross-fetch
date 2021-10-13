require('../../setup.env')
const defaultExport = require('../../..')
const namedExports = require('../../..')
const { addModuleSuite, addPonyfillSuite, addNativeSuite } = require('../module.spec')

if (/globals=off/.test(location.search)) {
  describe('Browser:Ponyfill:Require:Webpack', () => {
    addModuleSuite(namedExports)
    addPonyfillSuite({ ...namedExports, defaultExport })
  })
} else {
  describe('Browser:Native:Require:Webpack', () => {
    addModuleSuite(namedExports)
    addNativeSuite({ fetch })
  })
}

mocha.checkLeaks()
mocha.run()
