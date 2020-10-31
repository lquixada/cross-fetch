import '../../../polyfill'

import fetch, * as ponyfill from '../../..'
import addModuleSuite from '../../module.spec'

addModuleSuite('Browser: import on Webpack bundle', {
  ...ponyfill,
  defaultExport: fetch
})
