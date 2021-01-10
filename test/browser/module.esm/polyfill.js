import '../setup.env'
import '../../../polyfill'
import addModuleSuite from '../../polyfill.spec'

describe('Browser: import polyfill on Webpack bundle', () => {
  addModuleSuite()
})

mocha.checkLeaks()
mocha.run()
