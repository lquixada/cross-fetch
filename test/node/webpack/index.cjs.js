require('../setup')
require('../../../dist/node-polyfill')
const ponyfill = require('../../../dist/node-ponyfill')

describe('Node: require on Webpack bundle', () => {
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

    it('should polyfill the Headers constructor', () => {
      expect(Headers).to.be.a('function')
    })
  })

  describe('Ponyfill', () => {
    // Shadows polyfill
    const { fetch, Request, Response, Headers } = ponyfill

    it('should import the fetch function', () => {
      expect(fetch).to.be.a('function')
      expect(fetch.polyfill).to.equal(false)
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
