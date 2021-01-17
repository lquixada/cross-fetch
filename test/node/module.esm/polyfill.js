import '../setup.server'
import '../../../polyfill'
import { addModuleSuite, addPolyfillSuite } from '../../module.spec'

describe('Node: import polyfill on Webpack bundle', () => {
  addModuleSuite({ fetch, Request, Response, Headers })
  addPolyfillSuite({ fetch })
})
