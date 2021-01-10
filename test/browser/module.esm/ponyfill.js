import '../setup.env'
import fetch, * as namedExports from '../../..'
import addModuleSuite from '../../ponyfill.spec'

describe('Browser: import ponyfill on Webpack bundle', () => {
  addModuleSuite({
    ...namedExports,
    defaultExport: fetch
  })
})

mocha.checkLeaks()
mocha.run()
