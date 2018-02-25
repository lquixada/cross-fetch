(function (global) {

  // This is a suite that tests different parts of the fetch api. It is encapsulated
  // in a function in order to run on two test environments:
  // * browser/
  // * node/
  function runSuite(envName) {

    // Helper function
    const responseToText = function (res) {
      if (res.status >= 400) {
        throw new Error('Bad server response');
      }

      return res.text();
    };

    describe(envName, function () {
      describe('fetch', function () {
        it('should be defined', function () {
          expect(fetch).to.be.a('function');
        });

        it('should be a polyfill', function () {
          expect(fetch.polyfill).to.be.true;
        });

        it('should facilitate the making of requests', function () {
          return fetch('//lquixa.da/succeed.txt')
            .then(responseToText)
            .then(function (data) {
              expect(data).to.equal('hello world.');
            });
        });

        it('should do the right thing with bad requests', function () {
          return fetch('//lquixa.da/fail.txt')
            .then(responseToText)
            .catch(err => {
              expect(err.toString()).to.equal("Error: Bad server response");
            });
        });
      });

      describe('Request', function () {
        it('should be defined', function () {
          expect(Request).to.be.a('function');
        });

        it('should define GET as default method', function () {
          const request = new Request('//lquixa.da/');
          expect(request.method).to.equal('GET');
        });
      });

      describe('Response', function () {
        it('should be defined', function () {
          expect(Response).to.be.a('function');
        });

        it('should be ok :)', function () {
          const response = new Response();
          expect(response.ok).to.be.ok;
        });
      });

      describe('Headers', function () {
        it('should be defined', function () {
          expect(Headers).to.be.a('function');
        });

        it('should set a header', function () {
          const headers = new Headers({'X-Custom': 'foo'});
          expect(headers.get('X-Custom')).to.equal('foo');
        });
      });
    });
  }

  // Since this test suite needs to run on different environments,
  // we used an UMD-like approach here.
  if (typeof module === 'object' && module.exports) {
      module.exports = runSuite;
  } else {
      global.runSuite = runSuite;
  }
}(typeof self !== 'undefined' ? self : this));

