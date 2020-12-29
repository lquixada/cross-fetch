import '../setup.server'
import fetch, * as ponyfill from '../../..'
import addModuleSuite from '../../ponyfill.spec'

addModuleSuite('Node: import ponyfill on Webpack bundle', {
  ...ponyfill,
  defaultExport: fetch
})
