describe('ReactNative', () => {
  it('re-exports the global functions', () => {
    const globalFetch = global.fetch = function globalFetch () {}
    const globalHeaders = global.Headers = function globalHeaders () {}
    const globalRequest = global.Request = function globalRequest () {}
    const globalResponse = global.Response = function globalResponse () {}

    const { fetch, Request, Response, Headers } = require('../../dist/react-native-ponyfill')

    expect(fetch).to.equal(globalFetch)
    expect(Headers).to.equal(globalHeaders)
    expect(Request).to.equal(globalRequest)
    expect(Response).to.equal(globalResponse)

    delete global.fetch
    delete global.Headers
    delete global.Request
    delete global.Response
  })

  it('does not touch the global functions when polyfilling', () => {
    const globalFetch = global.fetch = function globalFetch () {}
    const globalHeaders = global.Headers = function globalHeaders () {}
    const globalRequest = global.Request = function globalRequest () {}
    const globalResponse = global.Response = function globalResponse () {}

    require('../../dist/react-native-polyfill')

    expect(fetch).to.equal(globalFetch)
    expect(Headers).to.equal(globalHeaders)
    expect(Request).to.equal(globalRequest)
    expect(Response).to.equal(globalResponse)

    delete global.fetch
    delete global.Headers
    delete global.Request
    delete global.Response
  })
})
