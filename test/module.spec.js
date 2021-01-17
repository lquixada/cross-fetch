/**
 * This file has all the tests needed to ensure cross-fetch is properly and equally
 * imported/required in webpack bundle for node and browser environments.
 */

function addModuleSuite ({ fetch, Request, Response, Headers }) {
  it('should have the fetch function exposed', () => {
    expect(fetch).to.be.a('function')
  })

  it('should have the Request constructor exposed', () => {
    expect(Request).to.be.a('function')
  })

  it('should have the Response constructor exposed', () => {
    expect(Response).to.be.a('function')
  })

  it('should have Headers constructor exposed', () => {
    expect(Headers).to.be.a('function')
  })
}

function addPolyfillSuite ({ fetch }) {
  it('should polyfill the fetch function', () => {
    expect(fetch.polyfill).to.equal(true)
    expect(fetch.ponyfill).to.equal(undefined)
  })
}

function addPonyfillSuite ({ fetch, defaultExport }) {
  it('should ponyfill the fetch function', () => {
    expect(fetch.polyfill).to.equal(undefined)
    expect(fetch.ponyfill).to.equal(true)
  })

  it('should import the fetch function as the default', () => {
    expect(defaultExport).to.equal(fetch)
  })
}

module.exports = {
  addModuleSuite,
  addPolyfillSuite,
  addPonyfillSuite
}
