require('../setup.env')
const defaultExport = require('../../..')
const namedExports = require('../../..')
const { addModuleSuite, addPonyfillSuite } = require('../../module.spec')

describe('Browser: require ponyfill on Webpack bundle', () => {
  addModuleSuite(namedExports)
  addPonyfillSuite({ ...namedExports, defaultExport })
})

mocha.checkLeaks()
mocha.run()
