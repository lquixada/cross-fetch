/**
 * The fetch.spec.js file has all the tests needed to assure cross-fetch is properly
 * working. It is the same specs file that runs across different settings provided
 * by the test/ folder.
 */

function addSuite (envName, ponyfill) {
  describe(envName, () => {
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
}

// Since this test suite needs to run on different environments,
// we used a simplified UMD pattern here.
if (typeof module === 'object' && module.exports) {
  module.exports = addSuite
}
