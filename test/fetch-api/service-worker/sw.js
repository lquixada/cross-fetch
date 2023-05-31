/* eslint-disable no-undef */
import fetch, { Request, Response, Headers } from '../../..'

const logChannel = new BroadcastChannel('sw-logger')

// Redirect all logs to top window
console.log = (...args) => logChannel.postMessage(args)

importScripts('../../../node_modules/mocha/mocha.js')
importScripts('../../../node_modules/chai/chai.js')
importScripts('./sw.reporter.js')

importScripts('../api.spec.js')
importScripts('../../module-system/module.spec.js')

globalThis.expect = chai.expect
globalThis.fetch = fetch
globalThis.Request = Request
globalThis.Response = Response
globalThis.Headers = Headers

mocha.setup({
  ui: 'bdd',
  reporter: SWReporter
})

describe('Browser:Fetch:ServiceWorker', () => {
  addFetchSuite()
  addNativeSuite({ fetch })
})

mocha.run()
