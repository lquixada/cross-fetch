import '../../../polyfill'

import fetch, * as ponyfill from '../../..'
import addSuite from '../../module.spec'

ponyfill.defaultExport = fetch

addSuite('Browser: import on Webpack bundle', ponyfill)
