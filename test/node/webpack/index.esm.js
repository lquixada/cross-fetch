import '../setup'
import '../../../dist/node-polyfill'
import * as ponyfill from '../../../dist/node-ponyfill'
import addSuite from '../../module.spec'

addSuite('Node: import on Webpack bundle', ponyfill)
