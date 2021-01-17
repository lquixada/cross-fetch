import '../setup.server'
import defaultExport, * as namedExports from '../../..'
import { addModuleSuite, addPonyfillSuite } from '../../module.spec'

describe('Node: import ponyfill on Webpack bundle', () => {
  addModuleSuite(namedExports)
  addPonyfillSuite({ ...namedExports, defaultExport })
})
