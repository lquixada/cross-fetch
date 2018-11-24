require('../../../dist/browser-polyfill')
const ponyfill = require('../../../dist/browser-ponyfill')

describe('Browser: require on Webpack bundle', () => {
  describe('Polyfill', () => {
    it('should polyfill the fetch function', () => {
      expect(fetch).to.be.a('function')
      expect(fetch.polyfill).to.equal(true)
    })

    it('should polyfill the Request constructor', () => {
      expect(Request).to.be.a('function')
    })

    it('should polyfill the Response constructor', () => {
      expect(Response).to.be.a('function')
    })

    it('should polyfill Headers constructor', () => {
      expect(Headers).to.be.a('function')
    })
  })

  describe('Ponyfill', () => {
    // Shadows polyfill
    const { fetch, Request, Response, Headers } = ponyfill

    it('should import the fetch function', () => {
      expect(fetch).to.be.a('function')
      expect(fetch.polyfill).to.equal(undefined)
    })

    it('should import the Request constructor', () => {
      expect(Request).to.be.a('function')
    })

    it('should import the Response constructor', () => {
      expect(Response).to.be.a('function')
    })

    it('should import the Headers constructor', () => {
      expect(Headers).to.be.a('function')
    })
  })
})
