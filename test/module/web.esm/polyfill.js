import '../../setup.env'
import '../../../polyfill'
import { addModuleSuite, addPolyfillSuite, addNativeSuite } from '../module.spec'

if (/globals=off/.test(location.search)) {
  describe('Browser:Polyfill:Import:Webpack', () => {
    addModuleSuite({ fetch, Request, Response, Headers })
    addPolyfillSuite({ fetch })
  })
} else {
  describe('Browser:Native:Import:Webpack', () => {
    addModuleSuite({ fetch, Request, Response, Headers })
    addNativeSuite({ fetch })
  })
}

mocha.checkLeaks()
mocha.run()
