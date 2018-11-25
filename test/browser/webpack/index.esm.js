import '../../../dist/browser-polyfill'

import fetch, * as ponyfill from '../../../dist/browser-ponyfill'
import addSuite from '../../module.spec'

ponyfill.defaultExport = fetch

addSuite('Browser: import on Webpack bundle', ponyfill)
