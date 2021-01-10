import '../setup.server'
import '../../../polyfill'
import addModuleSuite from '../../polyfill.spec'

describe('Node: import polyfill on Webpack bundle', () => {
  addModuleSuite()
})
