import '../setup.env'
import '../../../polyfill'
import { addModuleSuite, addPolyfillSuite } from '../../module.spec'

describe('Browser: import polyfill on Webpack bundle', () => {
  addModuleSuite({ fetch, Request, Response, Headers })
  addPolyfillSuite({ fetch })
})

mocha.checkLeaks()
mocha.run()
