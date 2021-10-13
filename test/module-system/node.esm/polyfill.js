import '../../../polyfill'
import { addModuleSuite, addPolyfillSuite } from '../module.spec'

describe('Node:Polyfill:Import:Webpack', () => {
  addModuleSuite({ fetch, Request, Response, Headers })
  addPolyfillSuite({ fetch })
})
