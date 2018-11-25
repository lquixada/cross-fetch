import '../setup'
import '../../../dist/node-polyfill'

import fetch, * as ponyfill from '../../../dist/node-ponyfill'
import addSuite from '../../module.spec'

ponyfill.defaultExport = fetch

addSuite('Node: import on Webpack bundle', ponyfill)
