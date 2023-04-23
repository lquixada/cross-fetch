// Delete node's native fetch api to force the polyfill installation for testing purposes
delete global.fetch
delete global.Request
delete global.Response
delete global.Headers
