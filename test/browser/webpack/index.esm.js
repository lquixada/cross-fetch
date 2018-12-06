import '../../../polyfill'

import fetch, * as ponyfill from '../../..'
import addModuleSuite from '../../module.spec'

ponyfill.defaultExport = fetch

addModuleSuite('Browser: import on Webpack bundle', ponyfill)
