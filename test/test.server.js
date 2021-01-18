const http = require("http");

const hostname = "127.0.0.1";
const port = 8000;

// Create HTTP server
const server = http.createServer((req, res) => {
  let { method, url } = req;

  console.log(method, url);
  if (url === '/request') {
    const headers = {}

    for (const key in req.headers) {
      const value = req.headers[key]
      headers[key] = Array.isArray(value) ? value[0] : value
    }

    res.writeHead(200, {
      'Content-Type': 'application/json',
      Date: 'Sat, 23 Sep 2017 15:41:16 GMT-0300'
    });

    let body = '';
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      res.end(JSON.stringify({
        method,
        headers,
        body
      }));
    });

    return;
  }

  let payload = [200, 'default'];

  if (method === 'GET') {
    switch (url) {
      case '/succeed': payload = [200, 'hello world.']; break;
      case '/fail': payload = [404, 'Good bye world.']; break;
      case '/error': payload = [500, 'error world.']; break;
    }
  }

  res.writeHead(payload[0], {'Content-Type': 'text/plain'});
  res.end(payload[1]);
});

// Prints a log once the server starts listening
server.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
})
