import '../../setup.env'
import defaultExport, * as namedExports from '../../..'
import { addModuleSuite, addPonyfillSuite, addNativeSuite } from '../module.spec'

if (/globals=off/.test(location.search)) {
  describe('Browser:Ponyfill:Import:Webpack', () => {
    addModuleSuite(namedExports)
    addPonyfillSuite({ ...namedExports, defaultExport })
  })
} else {
  describe('Browser:Native:Import:Webpack', () => {
    addModuleSuite(namedExports)
    addNativeSuite({ fetch })
  })
}

mocha.checkLeaks()
mocha.run()
