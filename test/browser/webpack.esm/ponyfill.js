import '../setup.env'
import fetch, * as namedExports from '../../..'
import addModuleSuite from '../../ponyfill.spec'

addModuleSuite('Browser: import ponyfill on Webpack bundle', {
  ...namedExports,
  defaultExport: fetch
})

mocha.checkLeaks()
mocha.run()
