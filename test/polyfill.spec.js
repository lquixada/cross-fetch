/**
 * This file has all the tests needed to ensure cross-fetch is properly and equally
 * imported/required in webpack bundle for node and browser environments.
 */

function addModuleSuite (name) {
  describe(name, () => {
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
}

module.exports = addModuleSuite
