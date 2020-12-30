import '../setup.env'
import '../../../polyfill'
import addModuleSuite from '../../polyfill.spec'

addModuleSuite('Browser: import polyfill on Webpack bundle')

mocha.checkLeaks()
mocha.run()
