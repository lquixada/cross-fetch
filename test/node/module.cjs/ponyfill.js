require('../setup.server')

const defaultExport = require('../../..')
const namedExports = require('../../..')
const { addModuleSuite, addPonyfillSuite } = require('../../module.spec')

describe('Node: require ponyfill on Webpack bundle', () => {
  addModuleSuite(namedExports)
  addPonyfillSuite({ ...namedExports, defaultExport })
})
