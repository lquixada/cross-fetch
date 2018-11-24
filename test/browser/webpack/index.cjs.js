require('../../../dist/browser-polyfill')
const ponyfill = require('../../../dist/browser-ponyfill')

describe('Browser Webpack CJS', () => {
  describe('Polyfill', () => {
    it('should polyfill Fetch', () => {
      expect(fetch).to.be.a('function')
      expect(fetch.polyfill).to.equal(true)
    })

    it('should polyfill Request', () => {
      expect(Request).to.be.a('function')
    })

    it('should polyfill Response', () => {
      expect(Response).to.be.a('function')
    })

    it('should polyfill Headers', () => {
      expect(Headers).to.be.a('function')
    })
  })

  describe('Ponyfill', () => {
    // Shadows polyfill
    const { fetch, Request, Response, Headers } = ponyfill

    it('should import Fetch', () => {
      expect(fetch).to.be.a('function')
      expect(fetch.polyfill).to.equal(undefined)
    })

    it('should import Request', () => {
      expect(Request).to.be.a('function')
    })

    it('should import Response', () => {
      expect(Response).to.be.a('function')
    })

    it('should import Headers', () => {
      expect(Headers).to.be.a('function')
    })
  })
})
