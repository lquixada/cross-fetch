import '../setup.env'
import defaultExport, * as namedExports from '../../..'
import { addModuleSuite, addPonyfillSuite } from '../../module.spec'

describe('Browser: import ponyfill on Webpack bundle', () => {
  addModuleSuite(namedExports)
  addPonyfillSuite({ ...namedExports, defaultExport })
})

mocha.checkLeaks()
mocha.run()
