module.exports = exports = global.fetch
exports.fetch = global.fetch
exports.Headers = global.Headers
exports.Request = global.Request
exports.Response = global.Response

// Needed for TypeScript consumers without esModuleInterop.
exports.default = global.fetch
