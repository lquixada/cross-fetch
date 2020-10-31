import '../setup'
import '../../../polyfill'

import fetch, * as ponyfill from '../../..'
import addModuleSuite from '../../module.spec'

addModuleSuite('Node: import on Webpack bundle', {
  ...ponyfill,
  defaultExport: fetch
})
