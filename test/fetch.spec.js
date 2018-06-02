function addSuite(envName) {

  var responseToText = function (res) {
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

      // Ensure that we're testing the polyfill version rather the native one
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
          .catch(function (err) {
            expect(err.toString()).to.equal('Error: Bad server response');
          });
      });
    });

    describe('Request', function () {
      it('should be defined', function () {
        expect(Request).to.be.a('function');
      });

      it('should define GET as default method', function () {
        var request = new Request('//lquixa.da/');
        expect(request.method).to.equal('GET');
      });
    });

    describe('Response', function () {
      it('should be defined', function () {
        expect(Response).to.be.a('function');
      });

      it('should be ok :)', function () {
        var response = new Response();
        expect(response.ok).to.be.ok;
      });
    });

    describe('Headers', function () {
      it('should be defined', function () {
        expect(Headers).to.be.a('function');
      });

      it('should set a header', function () {
        var headers = new Headers({'Custom': 'foo'});
        expect(headers.get('Custom')).to.equal('foo');
      });

      it('should set a multi-value header', function () {
        var headers = new Headers({'Custom': ['header1', 'header2']});
        expect(headers.get('Custom')).to.equal('header1,header2');
      });

      it('should set a undefined header', function () {
        var headers = new Headers({'Custom': null});
        expect(headers.get('Custom')).to.equal('null');
      });

      it('should set a null header', function () {
        var headers = new Headers({'Custom': undefined});
        expect(headers.get('Custom')).to.equal('undefined');
      });

      it('should not init an invalid header', function () {
        expect(function () { new Headers({ 'Héy': 'ok' }); }).to.throw();
      });

      it('should not set an invalid header', function () {
        var headers = new Headers();
        expect(function () { headers.set('Héy', 'ok'); }).to.throw();
      });

      it('should not get an invalid header', function () {
        var headers = new Headers();
        expect(function () { headers.get('Héy'); }).to.throw();
      });
    });
  });
}

// Since this test suite needs to run on different environments,
// we used a simplified UMD pattern here.
if (typeof module === 'object' && module.exports) {
    module.exports = addSuite;
}
