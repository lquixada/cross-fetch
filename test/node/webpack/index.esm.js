import '../setup'
import '../../../polyfill'

import fetch, * as ponyfill from '../../..'
import addModuleSuite from '../../module.spec'

ponyfill.defaultExport = fetch

addModuleSuite('Node: import on Webpack bundle', ponyfill)
