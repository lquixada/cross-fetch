const defaultExport = require('../../..')
const namedExports = require('../../..')
const { addModuleSuite, addPonyfillSuite } = require('../module.spec')

describe('Node:Ponyfill:Require:Webpack', () => {
  addModuleSuite(namedExports)
  addPonyfillSuite({ ...namedExports, defaultExport })
})
