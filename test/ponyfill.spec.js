/**
 * This file has all the tests needed to ensure cross-fetch is properly and equally
 * imported/required in webpack bundle for node and browser environments.
 */

function addModuleSuite (ponyfill) {
  const { fetch, Request, Response, Headers, defaultExport } = ponyfill

  it('should import the fetch function', () => {
    expect(fetch).to.be.a('function')
    expect(fetch.polyfill).to.equal(undefined)
    expect(fetch.ponyfill).to.equal(true)
  })

  it('should import the fetch function as the default', () => {
    expect(defaultExport).to.equal(fetch)
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
}

module.exports = addModuleSuite
