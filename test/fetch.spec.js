/**
 * This file has all the tests needed to ensure cross-fetch is properly and equally
 * working in browser and node environment.
 */

function addSuite (envName) {
  var responseToText = function (res) {
    if (res.status >= 400) {
      throw new Error('Bad server response')
    }

    return res.text()
  }

  describe(envName, function () {
    describe('fetch', function () {
      it('should be defined', function () {
        expect(fetch).to.be.a('function')
      })

      // Ensure that we're testing the polyfill version rather the native one
      it('should be a polyfill', function () {
        expect(fetch.polyfill).to.equal(true)
      })

      it('should facilitate the making of requests', function () {
        return fetch('//lquixa.da/succeed.txt')
          .then(responseToText)
          .then(function (data) {
            expect(data).to.equal('hello world.')
          })
      })

      it('should do the right thing with bad requests', function () {
        return fetch('//lquixa.da/fail.txt')
          .then(responseToText)
          .catch(function (err) {
            expect(err.toString()).to.equal('Error: Bad server response')
          })
      })
    })

    describe('Request', function () {
      it('should be defined', function () {
        expect(Request).to.be.a('function')
      })

      it('should define GET as default method', function () {
        var request = new Request('//lquixa.da/')
        expect(request.method).to.equal('GET')
      })
    })

    describe('Response', function () {
      it('should be defined', function () {
        expect(Response).to.be.a('function')
      })

      it('should be ok :)', function () {
        var response = new Response()
        expect(response.ok).to.equal(true)
      })
    })

    describe('Headers', function () {
      it('should be defined', function () {
        expect(Headers).to.be.a('function')
      })

      it('should set headers using object', function () {
        var object = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        var headers = new Headers(object)
        expect(headers.get('Content-Type')).to.equal('application/json')
        expect(headers.get('Accept')).to.equal('application/json')
      })

      it('should set headers using array', function () {
        var array = [['Content-Type', 'application/json'], ['Accept', 'application/json']]
        var headers = new Headers(array)
        expect(headers.get('Content-Type')).to.equal('application/json')
        expect(headers.get('Accept')).to.equal('application/json')
      })

      it('should set header name and value', function () {
        var headers = new Headers()
        headers.set('Content-Type', 'application/json')
        expect(headers.get('Content-Type')).to.equal('application/json')
      })

      it('should overwrite header value if it exists', function () {
        var headers = new Headers({ 'Content-Type': 'application/json' })
        headers.set('Content-Type', 'text/xml')
        expect(headers.get('Content-Type')).to.equal('text/xml')
      })

      it('should set a multi-value header', function () {
        var headers = new Headers({ 'Accept-Encoding': ['gzip', 'compress'] })
        expect(headers.get('Accept-Encoding')).to.equal('gzip,compress')
      })

      it('should set header key as case insensitive', function () {
        var headers = new Headers({ Accept: 'application/json' })
        expect(headers.get('ACCEPT')).to.equal('application/json')
        expect(headers.get('Accept')).to.equal('application/json')
        expect(headers.get('accept')).to.equal('application/json')
      })

      it('should append a header to the existing ones', function () {
        var headers = new Headers({ Accept: 'application/json' })
        headers.append('Accept', 'text/plain')
        expect(headers.get('Accept')).to.equal('application/json, text/plain')
      })

      it('should return null on no header found', function () {
        var headers = new Headers()
        expect(headers.get('Content-Type')).to.equal(null)
      })

      it('should set null header as a string value', function () {
        var headers = new Headers({ 'Custom': null })
        expect(headers.get('Custom')).to.equal('null')
      })

      it('should set an undefined header as a string value', function () {
        var headers = new Headers({ 'Custom': undefined })
        expect(headers.get('Custom')).to.equal('undefined')
      })

      it('should throw TypeError on invalid character in field name', function () {
        /* eslint-disable no-new */
        expect(function () { new Headers({ '<Accept>': 'application/json' }) }).to.throw()
        expect(function () { new Headers({ 'Accept:': 'application/json' }) }).to.throw()
        expect(function () {
          var headers = new Headers()
          headers.set({ field: 'value' }, 'application/json')
        }).to.throw()
      })

      it('should not init an invalid header', function () {
        /* eslint-disable no-new */
        expect(function () { new Headers({ 'Héy': 'ok' }) }).to.throw()
      })

      it('should not set an invalid header', function () {
        var headers = new Headers()
        expect(function () { headers.set('Héy', 'ok') }).to.throw()
      })

      it('should not append an invalid header', function () {
        var headers = new Headers()
        expect(function () { headers.append('Héy', 'ok') }).to.throw()
      })

      it('should not get an invalid header', function () {
        var headers = new Headers()
        expect(function () { headers.get('Héy') }).to.throw()
      })

      it('should copy headers', function () {
        var original = new Headers()
        original.append('Accept', 'application/json')
        original.append('Accept', 'text/plain')
        original.append('Content-Type', 'text/html')

        var headers = new Headers(original)
        expect(headers.get('Accept')).to.equal('application/json, text/plain')
        expect(headers.get('Content-type')).to.equal('text/html')
      })

      it('should detect if a header exists', function () {
        var headers = new Headers({ Accept: 'application/json' })
        expect(headers.has('Content-Type')).to.equal(false)

        headers.append('Content-Type', 'application/json')
        expect(headers.has('Content-Type')).to.equal(true)
      })

      it('should have headers that are set', function () {
        var headers = new Headers()
        headers.set('Content-Type', 'application/json')
        expect(headers.has('Content-Type')).to.equal(true)
      })

      it('deletes headers', function () {
        var headers = new Headers({ Accept: 'application/json' })
        expect(headers.has('Accept')).to.equal(true)

        headers.delete('Accept')
        expect(headers.has('Accept')).to.equal(false)
        expect(headers.get('Content-Type')).to.equal(null)
      })

      it('should convert field name to string on set and get', function () {
        var headers = new Headers()
        headers.set(1, 'application/json')
        expect(headers.has('1')).to.equal(true)
        expect(headers.get(1)).to.equal('application/json')
      })

      it('should convert field value to string on set and get', function () {
        var headers = new Headers()
        headers.set('Content-Type', 1)
        headers.set('X-CSRF-Token', undefined)
        expect(headers.get('Content-Type')).to.equal('1')
        expect(headers.get('X-CSRF-Token')).to.equal('undefined')
      })

      it('should be iterable with forEach', function () {
        var headers = new Headers()
        headers.append('Accept', 'application/json')
        headers.append('Accept', 'text/plain')
        headers.append('Content-Type', 'text/html')

        var results = []
        headers.forEach(function (value, key, object) {
          results.push({ value: value, key: key, object: object })
        })

        expect(results.length).to.equal(2)
        expect({ key: 'accept', value: 'application/json, text/plain', object: headers }).to.deep.equal(results[0])
        expect({ key: 'content-type', value: 'text/html', object: headers }).to.deep.equal(results[1])
      })

      it('should accept second thisArg argument for forEach', function () {
        var headers = new Headers({ Accept: 'application/json' })
        var thisArg = {}
        headers.forEach(function () {
          expect(this).to.equal(thisArg)
        }, thisArg)
      })

      it('should be iterable with keys', function () {
        var headers = new Headers({
          'Accept': 'application/json, text/plain',
          'Content-Type': 'text/html'
        })

        var iterator = headers.keys()
        expect({ done: false, value: 'accept' }).to.deep.equal(iterator.next())
        expect({ done: false, value: 'content-type' }).to.deep.equal(iterator.next())
        expect({ done: true, value: undefined }).to.deep.equal(iterator.next())
      })

      it('should be iterable with values', function () {
        var headers = new Headers({
          'Accept': 'application/json, text/plain',
          'Content-Type': 'text/html'
        })

        var iterator = headers.values()
        expect({ done: false, value: 'application/json, text/plain' }).to.deep.equal(iterator.next())
        expect({ done: false, value: 'text/html' }).to.deep.equal(iterator.next())
        expect({ done: true, value: undefined }).to.deep.equal(iterator.next())
      })

      it('should be iterable with entries', function () {
        var headers = new Headers({
          'Accept': 'application/json, text/plain',
          'Content-Type': 'text/html'
        })

        var iterator = headers.entries()
        expect({ done: false, value: ['accept', 'application/json, text/plain'] }).to.deep.equal(iterator.next())
        expect({ done: false, value: ['content-type', 'text/html'] }).to.deep.equal(iterator.next())
        expect({ done: true, value: undefined }).to.deep.equal(iterator.next())
      })
    })
  })
}

// Since this test suite needs to run on different environments,
// we used a simplified UMD pattern here.
if (typeof module === 'object' && module.exports) {
  module.exports = addSuite
}
