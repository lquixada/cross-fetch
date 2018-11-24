import '../../../dist/browser-polyfill'
import * as ponyfill from '../../../dist/browser-ponyfill'
import addSuite from '../../module.spec'

addSuite('Browser: import on Webpack bundle', ponyfill)
