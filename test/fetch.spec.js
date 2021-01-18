/**
 * This file has all the tests needed to ensure cross-fetch is properly and equally
 * working in browser and node environment.
 */

function addFetchSuite () {
  describe('fetch', () => {
    it('should be defined', () => {
      expect(fetch).to.be.a('function')
    })

    it('should facilitate the making of requests', () => {
      return fetch('http://localhost:8000/succeed')
        .then(function (res) {
          if (res.status >= 400) {
            throw new Error('Bad server response')
          }

          return res.text()
        })
        .then(function (data) {
          expect(data).to.equal('hello world.')
        })
    })

    it('should catch bad responses', () => {
      return fetch('http://localhost:8000/fail')
        .then(function (res) {
          if (res.status >= 400) {
            throw new Error('Bad server response')
          }

          return res.text()
        })
        .catch(function (err) {
          expect(err).to.be.an.instanceof(Error, 'Bad server response')
        })
    })

    it('should resolve promise on 500 error', () => {
      return fetch('http://localhost:8000/error')
        .then(function (res) {
          expect(res.status).to.equal(500)
          expect(res.ok).to.equal(false)
          return res.text()
        })
        .then(function (data) {
          expect(data).to.equal('error world.')
        })
    })

    it('should reject when Request constructor throws', () => {
      return fetch('http://localhost:8000/succeed', { method: 'GET', body: 'invalid' })
        .then(function () {
          expect.fail('Invalid Request init was accepted')
        })
        .catch(function (err) {
          expect(err).to.be.an.instanceof(TypeError, 'Rejected with Error')
        })
    })

    it('should send headers', () => {
      return fetch('http://localhost:8000/request', {
        headers: {
          Accept: 'application/json',
          'X-Test': '42'
        }
      })
        .then(function (res) {
          return res.json()
        })
        .then(function (data) {
          expect(data.headers.accept).to.equal('application/json')
          expect(data.headers['x-test']).to.equal('42')
        })
    })

    it('with Request as argument', () => {
      const request = new Request('http://localhost:8000/request', {
        headers: {
          Accept: 'application/json',
          'X-Test': '42'
        }
      })

      return fetch(request)
        .then(function (res) {
          return res.json()
        })
        .then(function (data) {
          expect(data.headers.accept).to.equal('application/json')
          expect(data.headers['x-test']).to.equal('42')
        })
    })

    it('should reuse same Request multiple times', () => {
      const request = new Request('http://localhost:8000/request', {
        headers: {
          Accept: 'application/json',
          'X-Test': '42'
        }
      })

      const responses = []

      return fetch(request)
        .then(function (res) {
          responses.push(res)
          return fetch(request)
        })
        .then(function (res) {
          responses.push(res)
          return fetch(request)
        })
        .then(function (res) {
          responses.push(res)
          return Promise.all(
            responses.map(function (res) {
              return res.json()
            })
          )
        })
        .then(function (data) {
          data.forEach(function (json) {
            expect(json.headers.accept).to.equal('application/json')
            expect(json.headers['x-test']).to.equal('42')
          })
        })
    })

    it('should populate body', () => {
      return fetch('http://localhost:8000/succeed')
        .then(function (res) {
          expect(res.status).to.equal(200)
          expect(res.ok).to.equal(true)
          return res.text()
        })
        .then(function (data) {
          expect(data).to.equal('hello world.')
        })
    })

    it('should parse headers', () => {
      return fetch('http://localhost:8000/request').then(function (res) {
        expect(res.headers.get('Date')).to.equal('Sat, 23 Sep 2017 15:41:16 GMT-0300')
        expect(res.headers.get('Content-Type')).to.equal('application/json; charset=utf-8')
      })
    })

    it('should support HTTP GET', () => {
      return fetch('http://localhost:8000/request', {
        method: 'get'
      })
        .then(function (res) {
          return res.json()
        })
        .then(function (data) {
          expect(data.method).to.equal('GET')
          expect(data.body).to.deep.equal({})
        })
    })

    it('should throw error on GET with body', () => {
      expect(function () {
        /* eslint-disable no-new */
        new Request('', {
          method: 'get',
          body: 'invalid'
        })
      }).to.throw(TypeError)
    })

    it('should throw error on HEAD with body', () => {
      expect(function () {
        /* eslint-disable no-new */
        new Request('', {
          method: 'head',
          body: 'invalid'
        })
      }).to.throw(TypeError)
    })

    it('should support HTTP POST', () => {
      return fetch('http://localhost:8000/request', {
        method: 'post',
        body: 'name=Hubot'
      })
        .then(function (res) {
          return res.json()
        })
        .then(function (data) {
          expect(data.method).to.equal('POST')
          expect(data.body).to.equal('name=Hubot')
        })
    })

    it('should support HTTP PUT', () => {
      return fetch('http://localhost:8000/request', {
        method: 'put',
        body: 'name=Hubot'
      })
        .then(function (res) {
          return res.json()
        })
        .then(function (data) {
          expect(data.method).to.equal('PUT')
          expect(data.body).to.equal('name=Hubot')
        })
    })

    it('should support HTTP PATCH', () => {
      return fetch('http://localhost:8000/request', {
        method: 'PATCH',
        body: 'name=Hubot'
      })
        .then(function (res) {
          return res.json()
        })
        .then(function (data) {
          expect(data.method).to.equal('PATCH')
          expect(data.body).to.equal('name=Hubot')
        })
    })

    it('should support HTTP DELETE', () => {
      return fetch('http://localhost:8000/request', {
        method: 'delete'
      })
        .then(function (res) {
          return res.json()
        })
        .then(function (data) {
          expect(data.method).to.equal('DELETE')
          expect(data.body).to.equal('')
        })
    })
  })

  describe('Request', () => {
    it('should be defined', () => {
      expect(Request).to.be.a('function')
    })

    it('should construct an url from string', () => {
      const request = new Request('http://localhost:8000/')
      expect(request.url).to.equal('http://localhost:8000/')
    })

    it('should construct url from object', () => {
      const url = {
        toString: function () {
          return 'http://localhost:8000/'
        }
      }
      const request = new Request(url)
      expect(request.url).to.equal('http://localhost:8000/')
    })

    it('should get GET as the default method', () => {
      const request = new Request('http://localhost:8000/')
      expect(request.method).to.equal('GET')
    })

    it('should set a method', () => {
      const request = new Request('http://localhost:8000/', {
        method: 'post'
      })
      expect(request.method).to.equal('POST')
    })

    it('should set headers', () => {
      const request = new Request('http://localhost:8000/', {
        headers: {
          accept: 'application/json',
          'Content-Type': 'text/plain'
        }
      })
      expect(request.headers.get('accept')).to.equal('application/json')
      expect(request.headers.get('content-type')).to.equal('text/plain')
    })

    it('should set a body', () => {
      const request = new Request('http://localhost:8000/', {
        method: 'post',
        body: 'Hello World!'
      })
      return request.text().then(function (data) {
        expect(data).to.equal('Hello World!')
      })
    })

    it.skip('construct with Request', () => {
      const request1 = new Request('http://localhost:8000/', {
        method: 'post',
        body: 'Hello World!',
        headers: {
          accept: 'application/json',
          'Content-Type': 'text/plain'
        }
      })
      const request2 = new Request(request1)

      return request2.text().then(function (data) {
        expect(data).to.equal('Hello World!')
        expect(request2.method).to.equal('POST')
        expect(request2.url).to.equal('http://localhost:8000/')
        expect(request2.headers.get('accept')).to.equal('application/json')
        expect(request2.headers.get('content-type')).to.equal('text/plain')

        return request1.text().then(
          function () {
            expect.fail('original request body should have been consumed')
          },
          function (err) {
            expect(err).to.be.an.instanceof(TypeError, 'expected TypeError for already read body')
          }
        )
      })
    })

    it('should construct a Request from another Request', () => {
      const request1 = new Request('http://localhost:8000/', {
        method: 'post',
        body: 'Hello World!',
        headers: {
          accept: 'application/json'
        }
      })
      const request2 = new Request(request1)

      expect(request2.method).to.equal('POST')
      expect(request2.headers.get('accept')).to.equal('application/json')

      return request2.text().then(function (data) {
        expect(data).to.equal('Hello World!')
      })
    })

    it('should construct with Request with overriden headers', () => {
      const request1 = new Request('http://localhost:8000/', {
        method: 'post',
        body: 'Hello World!',
        headers: {
          accept: 'application/json',
          'X-Request-ID': '123'
        }
      })
      const request2 = new Request(request1, {
        headers: { 'x-test': '42' }
      })

      expect(request2.headers.get('accept')).to.equal(null)
      expect(request2.headers.get('x-request-id')).to.equal(null)
      expect(request2.headers.get('x-test')).to.equal('42')
    })

    it('should construct with Request and override body', () => {
      const request1 = new Request('http://localhost:8000/', {
        method: 'post',
        body: 'Hello World!',
        headers: {
          'Content-Type': 'text/plain'
        }
      })
      const request2 = new Request(request1, {
        body: '{"wiggles": 5}',
        headers: { 'Content-Type': 'application/json' }
      })

      return request2.json().then(function (data) {
        expect(data.wiggles).to.equal(5)
        expect(request2.headers.get('content-type')).to.equal('application/json')
      })
    })

    it('construct with used Request body', () => {
      const request1 = new Request('http://localhost:8000/', {
        method: 'post',
        body: 'Hello World!'
      })

      return request1.text().then(function () {
        /* eslint-disable no-new */
        expect(function () { new Request(request1) }).to.throw()
      })
    })

    it('should not have implicit Content-Type', () => {
      const req = new Request('http://localhost:8000/')
      expect(req.headers.get('content-type')).to.equal(null)
    })

    it('POST with blank body should not have implicit Content-Type', () => {
      const req = new Request('http://localhost:8000/', {
        method: 'post'
      })
      expect(req.headers.get('content-type')).to.equal(null)
    })

    it('construct with string body sets Content-Type header', () => {
      const req = new Request('http://localhost:8000/', {
        method: 'post',
        body: 'Hello World!'
      })
      expect(req.headers.get('content-type')).to.equal('text/plain;charset=UTF-8')
    })

    it('construct with body and explicit header uses header', () => {
      const req = new Request('http://localhost:8000/', {
        method: 'post',
        headers: { 'Content-Type': 'image/png' },
        body: 'Hello World!'
      })
      expect(req.headers.get('content-type')).to.equal('image/png')
    })

    it('construct with unsupported body type', () => {
      const req = new Request('http://localhost:8000/', {
        method: 'post',
        body: {}
      })

      expect(req.headers.get('content-type')).to.equal('text/plain;charset=UTF-8')
      return req.text().then(function (data) {
        expect(data, '[object Object]')
      })
    })

    it('construct with null body', () => {
      const req = new Request('http://localhost:8000/', {
        method: 'post'
      })

      expect(req.headers.get('content-type')).to.equal(null)
      return req.text().then(function (data) {
        expect(data).to.equal('')
      })
    })

    it('should clone GET request', () => {
      const req = new Request('http://localhost:8000/', {
        headers: { 'content-type': 'text/plain' }
      })
      const clone = req.clone()
      expect(clone.url).to.equal(req.url)
      expect(clone.method).to.equal('GET')
      expect(clone.headers.get('content-type')).to.equal('text/plain')
      expect(clone.headers).to.not.equal(req.headers)
      expect(req.bodyUsed).to.equal(false)
    })

    it('should clone POST request', () => {
      const req = new Request('http://localhost:8000/', {
        method: 'post',
        headers: { 'content-type': 'text/plain' },
        body: 'Hello World!'
      })
      const clone = req.clone()

      expect(clone.method).to.equal('POST')
      expect(clone.headers.get('content-type')).to.equal('text/plain')
      expect(clone.headers).to.not.equal(req.headers)
      expect(req.bodyUsed).to.equal(false)
      return Promise.all([clone.text(), req.clone().text()]).then(function (data) {
        expect(data).to.deep.equal(['Hello World!', 'Hello World!'])
      })
    })

    it.skip('clone with used Request body', () => {
      const req = new Request('http://localhost:8000/', {
        method: 'post',
        body: 'Hello World!'
      })
      return req.text().then(function () {
        expect(function () { req.clone() }).to.throw()
      })
    })
  })

  describe('Response', () => {
    it('should be defined', () => {
      expect(Response).to.be.a('function')
    })

    it('should default to status 200 OK', () => {
      const res = new Response()
      expect(res.status).to.equal(200)
      expect(res.ok).to.equal(true)
    })

    it('should default to status 200 OK when an explicit undefined status code is passed', () => {
      const res = new Response('', { status: undefined })
      expect(res.status).to.equal(200)
      expect(res.ok).to.equal(true)
    })

    it('should create Headers object from raw headers', () => {
      const response = new Response('{"foo":"bar"}', {
        headers: { 'content-type': 'application/json' }
      })
      expect(response.headers).to.be.an.instanceof(Headers)
      return response.json().then(function (data) {
        expect(data.foo).to.equal('bar')
        return data
      })
    })

    it('should always creates a new Headers instance', () => {
      const headers = new Headers({ 'x-hello': 'world' })
      const res = new Response('', { headers: headers })

      expect(res.headers.get('x-hello')).to.equal('world')
      expect(res.headers).to.not.equal(headers)
    })

    it('should clone text response', () => {
      const res = new Response('{"foo":"bar"}', {
        headers: { 'content-type': 'application/json' }
      })
      const clone = res.clone()

      expect(clone.headers).to.not.equal(res.headers, 'headers were cloned')
      expect(clone.headers.get('content-type'), 'application/json')

      return Promise.all([clone.json(), res.json()]).then(function (data) {
        expect(data[0]).to.deep.equal(data[1], 'json of cloned object is the same as original')
      })
    })

    it('should construct with body and explicit header uses header', () => {
      const response = new Response('Hello World!', {
        headers: {
          'Content-Type': 'text/plain'
        }
      })

      expect(response.headers.get('content-type')).to.equal('text/plain')
    })

    it('should have no content when null is passed as first argument', () => {
      const response = new Response(null)

      expect(response.headers.get('content-type')).to.equal(null)
      return response.text().then(function (data) {
        expect(data).to.equal('')
      })
    })
  })

  describe('Headers', () => {
    it('should be defined', () => {
      expect(Headers).to.be.a('function')
    })

    it('should set headers using object', () => {
      const object = { 'Content-Type': 'application/json', Accept: 'application/json' }
      const headers = new Headers(object)
      expect(headers.get('Content-Type')).to.equal('application/json')
      expect(headers.get('Accept')).to.equal('application/json')
    })

    it('should set headers using array', () => {
      const array = [['Content-Type', 'application/json'], ['Accept', 'application/json']]
      const headers = new Headers(array)
      expect(headers.get('Content-Type')).to.equal('application/json')
      expect(headers.get('Accept')).to.equal('application/json')
    })

    it('should set header name and value', () => {
      const headers = new Headers()
      headers.set('Content-Type', 'application/json')
      expect(headers.get('Content-Type')).to.equal('application/json')
    })

    it('should overwrite header value if it exists', () => {
      const headers = new Headers({ 'Content-Type': 'application/json' })
      headers.set('Content-Type', 'text/xml')
      expect(headers.get('Content-Type')).to.equal('text/xml')
    })

    it('should set a multi-value header', () => {
      const headers = new Headers({ 'Accept-Encoding': ['gzip', 'compress'] })
      expect(headers.get('Accept-Encoding')).to.equal('gzip,compress')
    })

    it('should set header key as case insensitive', () => {
      const headers = new Headers({ Accept: 'application/json' })
      expect(headers.get('ACCEPT')).to.equal('application/json')
      expect(headers.get('Accept')).to.equal('application/json')
      expect(headers.get('accept')).to.equal('application/json')
    })

    it('should append a header to the existing ones', () => {
      const headers = new Headers({ Accept: 'application/json' })
      headers.append('Accept', 'text/plain')
      expect(headers.get('Accept')).to.equal('application/json, text/plain')
    })

    it('should return null on no header found', () => {
      const headers = new Headers()
      expect(headers.get('Content-Type')).to.equal(null)
    })

    it('should set null header as a string value', () => {
      const headers = new Headers({ Custom: null })
      expect(headers.get('Custom')).to.equal('null')
    })

    it('should set an undefined header as a string value', () => {
      const headers = new Headers({ Custom: undefined })
      expect(headers.get('Custom')).to.equal('undefined')
    })

    it('should throw TypeError on invalid character in field name', () => {
      /* eslint-disable no-new */
      expect(function () { new Headers({ '<Accept>': 'application/json' }) }).to.throw()
      expect(function () { new Headers({ 'Accept:': 'application/json' }) }).to.throw()
      expect(function () {
        const headers = new Headers()
        headers.set({ field: 'value' }, 'application/json')
      }).to.throw()
    })

    it('should not init an invalid header', () => {
      /* eslint-disable no-new */
      expect(function () { new Headers({ Héy: 'ok' }) }).to.throw()
    })

    it('should not set an invalid header', () => {
      const headers = new Headers()
      expect(function () { headers.set('Héy', 'ok') }).to.throw()
    })

    it('should not append an invalid header', () => {
      const headers = new Headers()
      expect(function () { headers.append('Héy', 'ok') }).to.throw()
    })

    it('should not get an invalid header', () => {
      const headers = new Headers()
      expect(function () { headers.get('Héy') }).to.throw()
    })

    it('should copy headers', () => {
      const original = new Headers()
      original.append('Accept', 'application/json')
      original.append('Accept', 'text/plain')
      original.append('Content-Type', 'text/html')

      const headers = new Headers(original)
      expect(headers.get('Accept')).to.equal('application/json, text/plain')
      expect(headers.get('Content-type')).to.equal('text/html')
    })

    it('should detect if a header exists', () => {
      const headers = new Headers({ Accept: 'application/json' })
      expect(headers.has('Content-Type')).to.equal(false)

      headers.append('Content-Type', 'application/json')
      expect(headers.has('Content-Type')).to.equal(true)
    })

    it('should have headers that are set', () => {
      const headers = new Headers()
      headers.set('Content-Type', 'application/json')
      expect(headers.has('Content-Type')).to.equal(true)
    })

    it('should delete header', () => {
      const headers = new Headers({ Accept: 'application/json' })
      expect(headers.has('Accept')).to.equal(true)

      headers.delete('Accept')
      expect(headers.has('Accept')).to.equal(false)
      expect(headers.get('Content-Type')).to.equal(null)
    })

    it('should convert field name to string on set and get', () => {
      const headers = new Headers()
      headers.set(1, 'application/json')
      expect(headers.has('1')).to.equal(true)
      expect(headers.get(1)).to.equal('application/json')
    })

    it('should convert field value to string on set and get', () => {
      const headers = new Headers()
      headers.set('Content-Type', 1)
      headers.set('X-CSRF-Token', undefined)
      expect(headers.get('Content-Type')).to.equal('1')
      expect(headers.get('X-CSRF-Token')).to.equal('undefined')
    })

    it('should be iterable with forEach', () => {
      const headers = new Headers()
      headers.append('Accept', 'application/json')
      headers.append('Accept', 'text/plain')
      headers.append('Content-Type', 'text/html')

      const results = []
      headers.forEach(function (value, key, object) {
        results.push({ value: value, key: key, object: object })
      })

      expect(results.length).to.equal(2)
      expect({ key: 'accept', value: 'application/json, text/plain', object: headers }).to.deep.equal(results[0])
      expect({ key: 'content-type', value: 'text/html', object: headers }).to.deep.equal(results[1])
    })

    it('should accept second thisArg argument for forEach', () => {
      const headers = new Headers({ Accept: 'application/json' })
      const thisArg = {}
      headers.forEach(function () {
        expect(this).to.equal(thisArg)
      }, thisArg)
    })

    it('should be iterable with keys', () => {
      const headers = new Headers({
        Accept: 'application/json, text/plain',
        'Content-Type': 'text/html'
      })

      const iterator = headers.keys()
      expect({ done: false, value: 'accept' }).to.deep.equal(iterator.next())
      expect({ done: false, value: 'content-type' }).to.deep.equal(iterator.next())
      expect({ done: true, value: undefined }).to.deep.equal(iterator.next())
    })

    it('should be iterable with values', () => {
      const headers = new Headers({
        Accept: 'application/json, text/plain',
        'Content-Type': 'text/html'
      })

      const iterator = headers.values()
      expect({ done: false, value: 'application/json, text/plain' }).to.deep.equal(iterator.next())
      expect({ done: false, value: 'text/html' }).to.deep.equal(iterator.next())
      expect({ done: true, value: undefined }).to.deep.equal(iterator.next())
    })

    it('should be iterable with entries', () => {
      const headers = new Headers({
        Accept: 'application/json, text/plain',
        'Content-Type': 'text/html'
      })

      const iterator = headers.entries()
      expect({ done: false, value: ['accept', 'application/json, text/plain'] }).to.deep.equal(iterator.next())
      expect({ done: false, value: ['content-type', 'text/html'] }).to.deep.equal(iterator.next())
      expect({ done: true, value: undefined }).to.deep.equal(iterator.next())
    })
  })
}

// Since this test suite needs to run on different environments,
// we used a simplified UMD pattern here.
if (typeof module === 'object' && module.exports) {
  module.exports = addFetchSuite
}
