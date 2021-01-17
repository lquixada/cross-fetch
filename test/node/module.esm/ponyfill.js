import '../setup.server'
import defaultExport, * as namedExports from '../../..'
import { addModuleSuite, addPonyfillSuite } from '../../module.spec'

describe('Node:Ponyfill:Import:Webpack', () => {
  addModuleSuite(namedExports)
  addPonyfillSuite({ ...namedExports, defaultExport })
})
