import '../setup'
import '../../../polyfill'

import fetch, * as ponyfill from '../../..'
import addSuite from '../../module.spec'

ponyfill.defaultExport = fetch

addSuite('Node: import on Webpack bundle', ponyfill)
