/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setup_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _setup_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_setup_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(38);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(___WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _module_spec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40);
/* harmony import */ var _module_spec__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_module_spec__WEBPACK_IMPORTED_MODULE_2__);




describe('Node:Ponyfill:Import:Webpack', () => {
  (0,_module_spec__WEBPACK_IMPORTED_MODULE_2__.addModuleSuite)(___WEBPACK_IMPORTED_MODULE_1__)
  ;(0,_module_spec__WEBPACK_IMPORTED_MODULE_2__.addPonyfillSuite)({ ...___WEBPACK_IMPORTED_MODULE_1__, defaultExport: (___WEBPACK_IMPORTED_MODULE_1___default()) })
})


/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const nock = __webpack_require__(2)

const reply = function (uri, reqBody) {
  const reqHeaders = Object.assign({}, this.req.headers)
  const resHeaders = {
    'Content-Type': 'application/json',
    Date: 'Sat, 23 Sep 2017 15:41:16 GMT-0300'
  }

  for (const key in reqHeaders) {
    const value = reqHeaders[key]
    reqHeaders[key] = Array.isArray(value) ? value[0] : value
  }

  return [
    200,
    JSON.stringify({
      method: this.method,
      headers: reqHeaders,
      body: reqBody || ''
    }),
    resHeaders
  ]
}

before(() => {
  nock('https://fet.ch')
    .persist()
    .get('/succeed').reply(200, 'hello world.')
    .get('/fail').reply(404, 'good bye world.')
    .get('/error').reply(500, 'error world.')
    .get('/request').reply(reply)
    .post('/request').reply(reply)
    .put('/request').reply(reply)
    .delete('/request').reply(reply)
    .patch('/request').reply(reply)
})


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const back = __webpack_require__(3)
const emitter = __webpack_require__(26)
const {
  activate,
  isActive,
  isDone,
  isOn,
  pendingMocks,
  activeMocks,
  removeInterceptor,
  disableNetConnect,
  enableNetConnect,
  removeAll,
  abortPendingRequests,
} = __webpack_require__(23)
const recorder = __webpack_require__(5)
const { Scope, load, loadDefs, define } = __webpack_require__(36)

module.exports = (basePath, options) => new Scope(basePath, options)

Object.assign(module.exports, {
  activate,
  isActive,
  isDone,
  pendingMocks,
  activeMocks,
  removeInterceptor,
  disableNetConnect,
  enableNetConnect,
  cleanAll: removeAll,
  abortPendingRequests,
  load,
  loadDefs,
  define,
  emitter,
  recorder: {
    rec: recorder.record,
    clear: recorder.clear,
    play: recorder.outputs,
  },
  restore: recorder.restore,
  back,
})

// We always activate Nock on import, overriding the globals.
// Setting the Back mode "activates" Nock by overriding the global entries in the `http/s` modules.
// If Nock Back is configured, we need to honor that setting for backward compatibility,
// otherwise we rely on Nock Back's default initializing side effect.
if (isOn()) {
  back.setMode(process.env.NOCK_BACK_MODE || 'dryrun')
}


/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const assert = __webpack_require__(4)
const recorder = __webpack_require__(5)
const {
  activate,
  disableNetConnect,
  enableNetConnect,
  removeAll: cleanAll,
} = __webpack_require__(23)
const { loadDefs, define } = __webpack_require__(36)

const { format } = __webpack_require__(12)
const path = __webpack_require__(37)
const debug = __webpack_require__(6)('nock.back')

let _mode = null

let fs

try {
  fs = __webpack_require__(35)
} catch (err) {
  // do nothing, probably in browser
}

/**
 * nock the current function with the fixture given
 *
 * @param {string}   fixtureName  - the name of the fixture, e.x. 'foo.json'
 * @param {object}   options      - [optional] extra options for nock with, e.x. `{ assert: true }`
 * @param {function} nockedFn     - [optional] callback function to be executed with the given fixture being loaded;
 *                                  if defined the function will be called with context `{ scopes: loaded_nocks || [] }`
 *                                  set as `this` and `nockDone` callback function as first and only parameter;
 *                                  if not defined a promise resolving to `{nockDone, context}` where `context` is
 *                                  aforementioned `{ scopes: loaded_nocks || [] }`
 *
 * List of options:
 *
 * @param {function} before       - a preprocessing function, gets called before nock.define
 * @param {function} after        - a postprocessing function, gets called after nock.define
 * @param {function} afterRecord  - a postprocessing function, gets called after recording. Is passed the array
 *                                  of scopes recorded and should return the array scopes to save to the fixture
 * @param {function} recorder     - custom options to pass to the recorder
 *
 */
function Back(fixtureName, options, nockedFn) {
  if (!Back.fixtures) {
    throw new Error(
      'Back requires nock.back.fixtures to be set\n' +
        'Ex:\n' +
        "\trequire(nock).back.fixtures = '/path/to/fixtures/'"
    )
  }

  if (typeof fixtureName !== 'string') {
    throw new Error('Parameter fixtureName must be a string')
  }

  if (arguments.length === 1) {
    options = {}
  } else if (arguments.length === 2) {
    // If 2nd parameter is a function then `options` has been omitted
    // otherwise `options` haven't been omitted but `nockedFn` was.
    if (typeof options === 'function') {
      nockedFn = options
      options = {}
    }
  }

  _mode.setup()

  const fixture = path.join(Back.fixtures, fixtureName)
  const context = _mode.start(fixture, options)

  const nockDone = function () {
    _mode.finish(fixture, options, context)
  }

  debug('context:', context)

  // If nockedFn is a function then invoke it, otherwise return a promise resolving to nockDone.
  if (typeof nockedFn === 'function') {
    nockedFn.call(context, nockDone)
  } else {
    return Promise.resolve({ nockDone, context })
  }
}

/*******************************************************************************
 *                                    Modes                                     *
 *******************************************************************************/

const wild = {
  setup: function () {
    cleanAll()
    recorder.restore()
    activate()
    enableNetConnect()
  },

  start: function () {
    return load() // don't load anything but get correct context
  },

  finish: function () {
    // nothing to do
  },
}

const dryrun = {
  setup: function () {
    recorder.restore()
    cleanAll()
    activate()
    //  We have to explicitly enable net connectivity as by default it's off.
    enableNetConnect()
  },

  start: function (fixture, options) {
    const contexts = load(fixture, options)

    enableNetConnect()
    return contexts
  },

  finish: function () {
    // nothing to do
  },
}

const record = {
  setup: function () {
    recorder.restore()
    recorder.clear()
    cleanAll()
    activate()
    disableNetConnect()
  },

  start: function (fixture, options) {
    if (!fs) {
      throw new Error('no fs')
    }
    const context = load(fixture, options)

    if (!context.isLoaded) {
      recorder.record({
        dont_print: true,
        output_objects: true,
        ...options.recorder,
      })

      context.isRecording = true
    }

    return context
  },

  finish: function (fixture, options, context) {
    if (context.isRecording) {
      let outputs = recorder.outputs()

      if (typeof options.afterRecord === 'function') {
        outputs = options.afterRecord(outputs)
      }

      outputs =
        typeof outputs === 'string' ? outputs : JSON.stringify(outputs, null, 4)
      debug('recorder outputs:', outputs)

      fs.mkdirSync(path.dirname(fixture), { recursive: true })
      fs.writeFileSync(fixture, outputs)
    }
  },
}

const lockdown = {
  setup: function () {
    recorder.restore()
    recorder.clear()
    cleanAll()
    activate()
    disableNetConnect()
  },

  start: function (fixture, options) {
    return load(fixture, options)
  },

  finish: function () {
    // nothing to do
  },
}

function load(fixture, options) {
  const context = {
    scopes: [],
    assertScopesFinished: function () {
      assertScopes(this.scopes, fixture)
    },
  }

  if (fixture && fixtureExists(fixture)) {
    let scopes = loadDefs(fixture)
    applyHook(scopes, options.before)

    scopes = define(scopes)
    applyHook(scopes, options.after)

    context.scopes = scopes
    context.isLoaded = true
  }

  return context
}

function applyHook(scopes, fn) {
  if (!fn) {
    return
  }

  if (typeof fn !== 'function') {
    throw new Error('processing hooks must be a function')
  }

  scopes.forEach(fn)
}

function fixtureExists(fixture) {
  if (!fs) {
    throw new Error('no fs')
  }

  return fs.existsSync(fixture)
}

function assertScopes(scopes, fixture) {
  const pending = scopes
    .filter(scope => !scope.isDone())
    .map(scope => scope.pendingMocks())

  if (pending.length) {
    assert.fail(
      format(
        '%j was not used, consider removing %s to rerecord fixture',
        [].concat(...pending),
        fixture
      )
    )
  }
}

const Modes = {
  wild, // all requests go out to the internet, dont replay anything, doesnt record anything

  dryrun, // use recorded nocks, allow http calls, doesnt record anything, useful for writing new tests (default)

  record, // use recorded nocks, record new nocks

  lockdown, // use recorded nocks, disables all http calls even when not nocked, doesnt record
}

Back.setMode = function (mode) {
  if (!(mode in Modes)) {
    throw new Error(`Unknown mode: ${mode}`)
  }

  Back.currentMode = mode
  debug('New nock back mode:', Back.currentMode)

  _mode = Modes[mode]
  _mode.setup()
}

Back.fixtures = null
Back.currentMode = null

module.exports = Back


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const debug = __webpack_require__(6)('nock.recorder')
const querystring = __webpack_require__(16)
const { inspect } = __webpack_require__(12)

const common = __webpack_require__(17)
const { restoreOverriddenClientRequest } = __webpack_require__(23)

const SEPARATOR = '\n<<<<<<-- cut here -->>>>>>\n'
let recordingInProgress = false
let outputs = []

function getScope(options) {
  const { proto, host, port } = common.normalizeRequestOptions(options)
  return common.normalizeOrigin(proto, host, port)
}

function getMethod(options) {
  return options.method || 'GET'
}

function getBodyFromChunks(chunks, headers) {
  // If we have headers and there is content-encoding it means that the body
  // shouldn't be merged but instead persisted as an array of hex strings so
  // that the response chunks can be mocked one by one.
  if (headers && common.isContentEncoded(headers)) {
    return {
      body: chunks.map(chunk => chunk.toString('hex')),
    }
  }

  const mergedBuffer = Buffer.concat(chunks)

  // The merged buffer can be one of three things:
  // 1. A UTF-8-representable string buffer which represents a JSON object.
  // 2. A UTF-8-representable buffer which doesn't represent a JSON object.
  // 3. A non-UTF-8-representable buffer which then has to be recorded as a hex string.
  const isUtf8Representable = common.isUtf8Representable(mergedBuffer)
  if (isUtf8Representable) {
    const maybeStringifiedJson = mergedBuffer.toString('utf8')
    try {
      return {
        isUtf8Representable,
        body: JSON.parse(maybeStringifiedJson),
      }
    } catch (err) {
      return {
        isUtf8Representable,
        body: maybeStringifiedJson,
      }
    }
  } else {
    return {
      isUtf8Representable,
      body: mergedBuffer.toString('hex'),
    }
  }
}

function generateRequestAndResponseObject({
  req,
  bodyChunks,
  options,
  res,
  dataChunks,
  reqheaders,
}) {
  const { body, isUtf8Representable } = getBodyFromChunks(
    dataChunks,
    res.headers
  )
  options.path = req.path

  return {
    scope: getScope(options),
    method: getMethod(options),
    path: options.path,
    // Is it deliberate that `getBodyFromChunks()` is called a second time?
    body: getBodyFromChunks(bodyChunks).body,
    status: res.statusCode,
    response: body,
    rawHeaders: res.rawHeaders,
    reqheaders: reqheaders || undefined,
    // When content-encoding is enabled, isUtf8Representable is `undefined`,
    // so we explicitly check for `false`.
    responseIsBinary: isUtf8Representable === false,
  }
}

function generateRequestAndResponse({
  req,
  bodyChunks,
  options,
  res,
  dataChunks,
  reqheaders,
}) {
  const requestBody = getBodyFromChunks(bodyChunks).body
  const responseBody = getBodyFromChunks(dataChunks, res.headers).body

  // Remove any query params from options.path so they can be added in the query() function
  let { path } = options
  const queryIndex = req.path.indexOf('?')
  let queryObj = {}
  if (queryIndex !== -1) {
    // Remove the query from the path
    path = path.substring(0, queryIndex)

    const queryStr = req.path.slice(queryIndex + 1)
    queryObj = querystring.parse(queryStr)
  }
  // Always encode the query parameters when recording.
  const encodedQueryObj = {}
  for (const key in queryObj) {
    const formattedPair = common.formatQueryValue(
      key,
      queryObj[key],
      common.percentEncode
    )
    encodedQueryObj[formattedPair[0]] = formattedPair[1]
  }

  const lines = []

  // We want a leading newline.
  lines.push('')

  const scope = getScope(options)
  lines.push(`nock('${scope}', {"encodedQueryParams":true})`)

  const methodName = getMethod(options).toLowerCase()
  if (requestBody) {
    lines.push(`  .${methodName}('${path}', ${JSON.stringify(requestBody)})`)
  } else {
    lines.push(`  .${methodName}('${path}')`)
  }

  Object.entries(reqheaders || {}).forEach(([fieldName, fieldValue]) => {
    const safeName = JSON.stringify(fieldName)
    const safeValue = JSON.stringify(fieldValue)
    lines.push(`  .matchHeader(${safeName}, ${safeValue})`)
  })

  if (queryIndex !== -1) {
    lines.push(`  .query(${JSON.stringify(encodedQueryObj)})`)
  }

  const statusCode = res.statusCode.toString()
  const stringifiedResponseBody = JSON.stringify(responseBody)
  const headers = inspect(res.rawHeaders)
  lines.push(`  .reply(${statusCode}, ${stringifiedResponseBody}, ${headers});`)

  return lines.join('\n')
}

//  This module variable is used to identify a unique recording ID in order to skip
//  spurious requests that sometimes happen. This problem has been, so far,
//  exclusively detected in nock's unit testing where 'checks if callback is specified'
//  interferes with other tests as its t.end() is invoked without waiting for request
//  to finish (which is the point of the test).
let currentRecordingId = 0

const defaultRecordOptions = {
  dont_print: false,
  enable_reqheaders_recording: false,
  logging: console.log,
  output_objects: false,
  use_separator: true,
}

function record(recOptions) {
  //  Trying to start recording with recording already in progress implies an error
  //  in the recording configuration (double recording makes no sense and used to lead
  //  to duplicates in output)
  if (recordingInProgress) {
    throw new Error('Nock recording already in progress')
  }

  recordingInProgress = true

  // Set the new current recording ID and capture its value in this instance of record().
  currentRecordingId = currentRecordingId + 1
  const thisRecordingId = currentRecordingId

  // Originally the parameter was a dont_print boolean flag.
  // To keep the existing code compatible we take that case into account.
  if (typeof recOptions === 'boolean') {
    recOptions = { dont_print: recOptions }
  }

  recOptions = { ...defaultRecordOptions, ...recOptions }

  debug('start recording', thisRecordingId, recOptions)

  const {
    dont_print: dontPrint,
    enable_reqheaders_recording: enableReqHeadersRecording,
    logging,
    output_objects: outputObjects,
    use_separator: useSeparator,
  } = recOptions

  debug(thisRecordingId, 'restoring overridden requests before new overrides')
  //  To preserve backward compatibility (starting recording wasn't throwing if nock was already active)
  //  we restore any requests that may have been overridden by other parts of nock (e.g. intercept)
  //  NOTE: This is hacky as hell but it keeps the backward compatibility *and* allows correct
  //    behavior in the face of other modules also overriding ClientRequest.
  common.restoreOverriddenRequests()
  //  We restore ClientRequest as it messes with recording of modules that also override ClientRequest (e.g. xhr2)
  restoreOverriddenClientRequest()

  //  We override the requests so that we can save information on them before executing.
  common.overrideRequests(function (proto, overriddenRequest, rawArgs) {
    const { options, callback } = common.normalizeClientRequestArgs(...rawArgs)
    const bodyChunks = []

    // Node 0.11 https.request calls http.request -- don't want to record things
    // twice.
    /* istanbul ignore if */
    if (options._recording) {
      return overriddenRequest(options, callback)
    }
    options._recording = true

    const req = overriddenRequest(options, function (res) {
      debug(thisRecordingId, 'intercepting', proto, 'request to record')

      //  We put our 'end' listener to the front of the listener array.
      res.once('end', function () {
        debug(thisRecordingId, proto, 'intercepted request ended')

        let reqheaders
        // Ignore request headers completely unless it was explicitly enabled by the user (see README)
        if (enableReqHeadersRecording) {
          // We never record user-agent headers as they are worse than useless -
          // they actually make testing more difficult without providing any benefit (see README)
          reqheaders = req.getHeaders()
          common.deleteHeadersField(reqheaders, 'user-agent')
        }

        const generateFn = outputObjects
          ? generateRequestAndResponseObject
          : generateRequestAndResponse
        let out = generateFn({
          req,
          bodyChunks,
          options,
          res,
          dataChunks,
          reqheaders,
        })

        debug('out:', out)

        //  Check that the request was made during the current recording.
        //  If it hasn't then skip it. There is no other simple way to handle
        //  this as it depends on the timing of requests and responses. Throwing
        //  will make some recordings/unit tests fail randomly depending on how
        //  fast/slow the response arrived.
        //  If you are seeing this error then you need to make sure that all
        //  the requests made during a single recording session finish before
        //  ending the same recording session.
        if (thisRecordingId !== currentRecordingId) {
          debug('skipping recording of an out-of-order request', out)
          return
        }

        outputs.push(out)

        if (!dontPrint) {
          if (useSeparator) {
            if (typeof out !== 'string') {
              out = JSON.stringify(out, null, 2)
            }
            logging(SEPARATOR + out + SEPARATOR)
          } else {
            logging(out)
          }
        }
      })

      let encoding
      // We need to be aware of changes to the stream's encoding so that we
      // don't accidentally mangle the data.
      const { setEncoding } = res
      res.setEncoding = function (newEncoding) {
        encoding = newEncoding
        return setEncoding.apply(this, arguments)
      }

      const dataChunks = []
      // Replace res.push with our own implementation that stores chunks
      const origResPush = res.push
      res.push = function (data) {
        if (data) {
          if (encoding) {
            data = Buffer.from(data, encoding)
          }
          dataChunks.push(data)
        }

        return origResPush.call(res, data)
      }

      if (callback) {
        callback(res, options, callback)
      } else {
        res.resume()
      }

      debug('finished setting up intercepting')

      // We override both the http and the https modules; when we are
      // serializing the request, we need to know which was called.
      // By stuffing the state, we can make sure that nock records
      // the intended protocol.
      if (proto === 'https') {
        options.proto = 'https'
      }
    })

    const recordChunk = (chunk, encoding) => {
      debug(thisRecordingId, 'new', proto, 'body chunk')
      if (!Buffer.isBuffer(chunk)) {
        chunk = Buffer.from(chunk, encoding)
      }
      bodyChunks.push(chunk)
    }

    const oldWrite = req.write
    req.write = function (chunk, encoding) {
      if (typeof chunk !== 'undefined') {
        recordChunk(chunk, encoding)
        oldWrite.apply(req, arguments)
      } else {
        throw new Error('Data was undefined.')
      }
    }

    // Starting in Node 8, `OutgoingMessage.end()` directly calls an internal
    // `write_` function instead of proxying to the public
    // `OutgoingMessage.write()` method, so we have to wrap `end` too.
    const oldEnd = req.end
    req.end = function (chunk, encoding, callback) {
      debug('req.end')
      if (typeof chunk === 'function') {
        callback = chunk
        chunk = null
      } else if (typeof encoding === 'function') {
        callback = encoding
        encoding = null
      }

      if (chunk) {
        recordChunk(chunk, encoding)
      }
      oldEnd.call(req, chunk, encoding, callback)
    }

    return req
  })
}

// Restore *all* the overridden http/https modules' properties.
function restore() {
  debug(
    currentRecordingId,
    'restoring all the overridden http/https properties'
  )

  common.restoreOverriddenRequests()
  restoreOverriddenClientRequest()
  recordingInProgress = false
}

function clear() {
  outputs = []
}

module.exports = {
  record,
  outputs: () => outputs,
  restore,
  clear,
}


/***/ }),
/* 6 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(7);
} else {
	module.exports = __webpack_require__(10);
}


/***/ }),
/* 7 */
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(8)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(9);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),
/* 9 */
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),
/* 10 */
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(11);
const util = __webpack_require__(12);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(13);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(8)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";
module.exports = require("tty");;

/***/ }),
/* 12 */
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),
/* 13 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(14);
const tty = __webpack_require__(11);
const hasFlag = __webpack_require__(15);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),
/* 14 */
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),
/* 15 */
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),
/* 16 */
/***/ ((module) => {

"use strict";
module.exports = require("querystring");;

/***/ }),
/* 17 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const debug = __webpack_require__(6)('nock.common')
const set = __webpack_require__(18)
const timers = __webpack_require__(19)
const url = __webpack_require__(20)
const util = __webpack_require__(12)

/**
 * Normalizes the request options so that it always has `host` property.
 *
 * @param  {Object} options - a parsed options object of the request
 */
function normalizeRequestOptions(options) {
  options.proto = options.proto || 'http'
  options.port = options.port || (options.proto === 'http' ? 80 : 443)
  if (options.host) {
    debug('options.host:', options.host)
    if (!options.hostname) {
      if (options.host.split(':').length === 2) {
        options.hostname = options.host.split(':')[0]
      } else {
        options.hostname = options.host
      }
    }
  }
  debug('options.hostname in the end: %j', options.hostname)
  options.host = `${options.hostname || 'localhost'}:${options.port}`
  debug('options.host in the end: %j', options.host)

  /// lowercase host names
  ;['hostname', 'host'].forEach(function (attr) {
    if (options[attr]) {
      options[attr] = options[attr].toLowerCase()
    }
  })

  return options
}

/**
 * Returns true if the data contained in buffer can be reconstructed
 * from its utf8 representation.
 *
 * @param  {Object} buffer - a Buffer object
 * @returns {boolean}
 */
function isUtf8Representable(buffer) {
  const utfEncodedBuffer = buffer.toString('utf8')
  const reconstructedBuffer = Buffer.from(utfEncodedBuffer, 'utf8')
  return reconstructedBuffer.equals(buffer)
}

//  Array where all information about all the overridden requests are held.
let requestOverrides = {}

/**
 * Overrides the current `request` function of `http` and `https` modules with
 * our own version which intercepts issues HTTP/HTTPS requests and forwards them
 * to the given `newRequest` function.
 *
 * @param  {Function} newRequest - a function handling requests; it accepts four arguments:
 *   - proto - a string with the overridden module's protocol name (either `http` or `https`)
 *   - overriddenRequest - the overridden module's request function already bound to module's object
 *   - options - the options of the issued request
 *   - callback - the callback of the issued request
 */
function overrideRequests(newRequest) {
  debug('overriding requests')
  ;['http', 'https'].forEach(function (proto) {
    debug('- overriding request for', proto)

    const moduleName = proto // 1 to 1 match of protocol and module is fortunate :)
    const module = {
      http: __webpack_require__(21),
      https: __webpack_require__(22),
    }[moduleName]
    const overriddenRequest = module.request
    const overriddenGet = module.get

    if (requestOverrides[moduleName]) {
      throw new Error(
        `Module's request already overridden for ${moduleName} protocol.`
      )
    }

    //  Store the properties of the overridden request so that it can be restored later on.
    requestOverrides[moduleName] = {
      module,
      request: overriddenRequest,
      get: overriddenGet,
    }
    // https://nodejs.org/api/http.html#http_http_request_url_options_callback
    module.request = function (input, options, callback) {
      return newRequest(proto, overriddenRequest.bind(module), [
        input,
        options,
        callback,
      ])
    }
    // https://nodejs.org/api/http.html#http_http_get_options_callback
    module.get = function (input, options, callback) {
      const req = newRequest(proto, overriddenGet.bind(module), [
        input,
        options,
        callback,
      ])
      req.end()
      return req
    }

    debug('- overridden request for', proto)
  })
}

/**
 * Restores `request` function of `http` and `https` modules to values they
 * held before they were overridden by us.
 */
function restoreOverriddenRequests() {
  debug('restoring requests')
  Object.entries(requestOverrides).forEach(
    ([proto, { module, request, get }]) => {
      debug('- restoring request for', proto)
      module.request = request
      module.get = get
      debug('- restored request for', proto)
    }
  )
  requestOverrides = {}
}

/**
 * In WHATWG URL vernacular, this returns the origin portion of a URL.
 * However, the port is not included if it's standard and not already present on the host.
 */
function normalizeOrigin(proto, host, port) {
  const hostHasPort = host.includes(':')
  const portIsStandard =
    (proto === 'http' && (port === 80 || port === '80')) ||
    (proto === 'https' && (port === 443 || port === '443'))
  const portStr = hostHasPort || portIsStandard ? '' : `:${port}`

  return `${proto}://${host}${portStr}`
}

/**
 * Get high level information about request as string
 * @param  {Object} options
 * @param  {string} options.method
 * @param  {number|string} options.port
 * @param  {string} options.proto Set internally. always http or https
 * @param  {string} options.hostname
 * @param  {string} options.path
 * @param  {Object} options.headers
 * @param  {string} body
 * @return {string}
 */
function stringifyRequest(options, body) {
  const { method = 'GET', path = '', port } = options
  const origin = normalizeOrigin(options.proto, options.hostname, port)

  const log = {
    method,
    url: `${origin}${path}`,
    headers: options.headers,
  }

  if (body) {
    log.body = body
  }

  return JSON.stringify(log, null, 2)
}

function isContentEncoded(headers) {
  const contentEncoding = headers['content-encoding']
  return typeof contentEncoding === 'string' && contentEncoding !== ''
}

function contentEncoding(headers, encoder) {
  const contentEncoding = headers['content-encoding']
  return contentEncoding !== undefined && contentEncoding.toString() === encoder
}

function isJSONContent(headers) {
  // https://tools.ietf.org/html/rfc8259
  const contentType = String(headers['content-type'] || '').toLowerCase()
  return contentType.startsWith('application/json')
}

/**
 * Return a new object with all field names of the headers lower-cased.
 *
 * Duplicates throw an error.
 */
function headersFieldNamesToLowerCase(headers) {
  if (!isPlainObject(headers)) {
    throw Error('Headers must be provided as an object')
  }

  const lowerCaseHeaders = {}
  Object.entries(headers).forEach(([fieldName, fieldValue]) => {
    const key = fieldName.toLowerCase()
    if (lowerCaseHeaders[key] !== undefined) {
      throw Error(
        `Failed to convert header keys to lower case due to field name conflict: ${key}`
      )
    }
    lowerCaseHeaders[key] = fieldValue
  })

  return lowerCaseHeaders
}

const headersFieldsArrayToLowerCase = headers => [
  ...new Set(headers.map(fieldName => fieldName.toLowerCase())),
]

/**
 * Converts the various accepted formats of headers into a flat array representing "raw headers".
 *
 * Nock allows headers to be provided as a raw array, a plain object, or a Map.
 *
 * While all the header names are expected to be strings, the values are left intact as they can
 * be functions, strings, or arrays of strings.
 *
 *  https://nodejs.org/api/http.html#http_message_rawheaders
 */
function headersInputToRawArray(headers) {
  if (headers === undefined) {
    return []
  }

  if (Array.isArray(headers)) {
    // If the input is an array, assume it's already in the raw format and simply return a copy
    // but throw an error if there aren't an even number of items in the array
    if (headers.length % 2) {
      throw new Error(
        `Raw headers must be provided as an array with an even number of items. [fieldName, value, ...]`
      )
    }
    return [...headers]
  }

  // [].concat(...) is used instead of Array.flat until v11 is the minimum Node version
  if (util.types.isMap(headers)) {
    return [].concat(...Array.from(headers, ([k, v]) => [k.toString(), v]))
  }

  if (isPlainObject(headers)) {
    return [].concat(...Object.entries(headers))
  }

  throw new Error(
    `Headers must be provided as an array of raw values, a Map, or a plain Object. ${headers}`
  )
}

/**
 * Converts an array of raw headers to an object, using the same rules as Nodes `http.IncomingMessage.headers`.
 *
 * Header names/keys are lower-cased.
 */
function headersArrayToObject(rawHeaders) {
  if (!Array.isArray(rawHeaders)) {
    throw Error('Expected a header array')
  }

  const accumulator = {}

  forEachHeader(rawHeaders, (value, fieldName) => {
    addHeaderLine(accumulator, fieldName, value)
  })

  return accumulator
}

const noDuplicatesHeaders = new Set([
  'age',
  'authorization',
  'content-length',
  'content-type',
  'etag',
  'expires',
  'from',
  'host',
  'if-modified-since',
  'if-unmodified-since',
  'last-modified',
  'location',
  'max-forwards',
  'proxy-authorization',
  'referer',
  'retry-after',
  'user-agent',
])

/**
 * Set key/value data in accordance with Node's logic for folding duplicate headers.
 *
 * The `value` param should be a function, string, or array of strings.
 *
 * Node's docs and source:
 * https://nodejs.org/api/http.html#http_message_headers
 * https://github.com/nodejs/node/blob/908292cf1f551c614a733d858528ffb13fb3a524/lib/_http_incoming.js#L245
 *
 * Header names are lower-cased.
 * Duplicates in raw headers are handled in the following ways, depending on the header name:
 * - Duplicates of field names listed in `noDuplicatesHeaders` (above) are discarded.
 * - `set-cookie` is always an array. Duplicates are added to the array.
 * - For duplicate `cookie` headers, the values are joined together with '; '.
 * - For all other headers, the values are joined together with ', '.
 *
 * Node's implementation is larger because it highly optimizes for not having to call `toLowerCase()`.
 * We've opted to always call `toLowerCase` in exchange for a more concise function.
 *
 * While Node has the luxury of knowing `value` is always a string, we do an extra step of coercion at the top.
 */
function addHeaderLine(headers, name, value) {
  let values // code below expects `values` to be an array of strings
  if (typeof value === 'function') {
    // Function values are evaluated towards the end of the response, before that we use a placeholder
    // string just to designate that the header exists. Useful when `Content-Type` is set with a function.
    values = [value.name]
  } else if (Array.isArray(value)) {
    values = value.map(String)
  } else {
    values = [String(value)]
  }

  const key = name.toLowerCase()
  if (key === 'set-cookie') {
    // Array header -- only Set-Cookie at the moment
    if (headers['set-cookie'] === undefined) {
      headers['set-cookie'] = values
    } else {
      headers['set-cookie'].push(...values)
    }
  } else if (noDuplicatesHeaders.has(key)) {
    if (headers[key] === undefined) {
      // Drop duplicates
      headers[key] = values[0]
    }
  } else {
    if (headers[key] !== undefined) {
      values = [headers[key], ...values]
    }

    const separator = key === 'cookie' ? '; ' : ', '
    headers[key] = values.join(separator)
  }
}

/**
 * Deletes the given `fieldName` property from `headers` object by performing
 * case-insensitive search through keys.
 *
 * @headers   {Object} headers - object of header field names and values
 * @fieldName {String} field name - string with the case-insensitive field name
 */
function deleteHeadersField(headers, fieldNameToDelete) {
  if (!isPlainObject(headers)) {
    throw Error('headers must be an object')
  }

  if (typeof fieldNameToDelete !== 'string') {
    throw Error('field name must be a string')
  }

  const lowerCaseFieldNameToDelete = fieldNameToDelete.toLowerCase()

  // Search through the headers and delete all values whose field name matches the given field name.
  Object.keys(headers)
    .filter(fieldName => fieldName.toLowerCase() === lowerCaseFieldNameToDelete)
    .forEach(fieldName => delete headers[fieldName])
}

/**
 * Utility for iterating over a raw headers array.
 *
 * The callback is called with:
 *  - The header value. string, array of strings, or a function
 *  - The header field name. string
 *  - Index of the header field in the raw header array.
 */
function forEachHeader(rawHeaders, callback) {
  for (let i = 0; i < rawHeaders.length; i += 2) {
    callback(rawHeaders[i + 1], rawHeaders[i], i)
  }
}

function percentDecode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '))
  } catch (e) {
    return str
  }
}

/**
 * URI encode the provided string, stringently adhering to RFC 3986.
 *
 * RFC 3986 reserves !, ', (, ), and * but encodeURIComponent does not encode them so we do it manually.
 *
 * https://tools.ietf.org/html/rfc3986
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 */
function percentEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  })
}

function matchStringOrRegexp(target, pattern) {
  const targetStr =
    target === undefined || target === null ? '' : String(target)

  return pattern instanceof RegExp
    ? pattern.test(targetStr)
    : targetStr === String(pattern)
}

/**
 * Formats a query parameter.
 *
 * @param key                The key of the query parameter to format.
 * @param value              The value of the query parameter to format.
 * @param stringFormattingFn The function used to format string values. Can
 *                           be used to encode or decode the query value.
 *
 * @returns *[] the formatted [key, value] pair.
 */
function formatQueryValue(key, value, stringFormattingFn) {
  // TODO: Probably refactor code to replace `switch(true)` with `if`/`else`.
  switch (true) {
    case typeof value === 'number': // fall-through
    case typeof value === 'boolean':
      value = value.toString()
      break
    case value === null:
    case value === undefined:
      value = ''
      break
    case typeof value === 'string':
      if (stringFormattingFn) {
        value = stringFormattingFn(value)
      }
      break
    case value instanceof RegExp:
      break
    case Array.isArray(value): {
      value = value.map(function (val, idx) {
        return formatQueryValue(idx, val, stringFormattingFn)[1]
      })
      break
    }
    case typeof value === 'object': {
      value = Object.entries(value).reduce(function (acc, [subKey, subVal]) {
        const subPair = formatQueryValue(subKey, subVal, stringFormattingFn)
        acc[subPair[0]] = subPair[1]

        return acc
      }, {})
      break
    }
  }

  if (stringFormattingFn) key = stringFormattingFn(key)
  return [key, value]
}

function isStream(obj) {
  return (
    obj &&
    typeof obj !== 'string' &&
    !Buffer.isBuffer(obj) &&
    typeof obj.setEncoding === 'function'
  )
}

/**
 * Converts the arguments from the various signatures of http[s].request into a standard
 * options object and an optional callback function.
 *
 * https://nodejs.org/api/http.html#http_http_request_url_options_callback
 *
 * Taken from the beginning of the native `ClientRequest`.
 * https://github.com/nodejs/node/blob/908292cf1f551c614a733d858528ffb13fb3a524/lib/_http_client.js#L68
 */
function normalizeClientRequestArgs(input, options, cb) {
  if (typeof input === 'string') {
    input = urlToOptions(new url.URL(input))
  } else if (input instanceof url.URL) {
    input = urlToOptions(input)
  } else {
    cb = options
    options = input
    input = null
  }

  if (typeof options === 'function') {
    cb = options
    options = input || {}
  } else {
    options = Object.assign(input || {}, options)
  }

  return { options, callback: cb }
}

/**
 * Utility function that converts a URL object into an ordinary
 * options object as expected by the http.request and https.request APIs.
 *
 * This was copied from Node's source
 * https://github.com/nodejs/node/blob/908292cf1f551c614a733d858528ffb13fb3a524/lib/internal/url.js#L1257
 */
function urlToOptions(url) {
  const options = {
    protocol: url.protocol,
    hostname:
      typeof url.hostname === 'string' && url.hostname.startsWith('[')
        ? url.hostname.slice(1, -1)
        : url.hostname,
    hash: url.hash,
    search: url.search,
    pathname: url.pathname,
    path: `${url.pathname}${url.search || ''}`,
    href: url.href,
  }
  if (url.port !== '') {
    options.port = Number(url.port)
  }
  if (url.username || url.password) {
    options.auth = `${url.username}:${url.password}`
  }
  return options
}

/**
 * Determines if request data matches the expected schema.
 *
 * Used for comparing decoded search parameters, request body JSON objects,
 * and URL decoded request form bodies.
 *
 * Performs a general recursive strict comparision with two caveats:
 *  - The expected data can use regexp to compare values
 *  - JSON path notation and nested objects are considered equal
 */
const dataEqual = (expected, actual) => {
  if (isPlainObject(expected)) {
    expected = expand(expected)
  }
  if (isPlainObject(actual)) {
    actual = expand(actual)
  }
  return deepEqual(expected, actual)
}

/**
 * Converts flat objects whose keys use JSON path notation to nested objects.
 *
 * The input object is not mutated.
 *
 * @example
 * { 'foo[bar][0]': 'baz' } -> { foo: { bar: [ 'baz' ] } }
 */
const expand = input =>
  Object.entries(input).reduce((acc, [k, v]) => set(acc, k, v), {})

/**
 * Performs a recursive strict comparison between two values.
 *
 * Expected values or leaf nodes of expected object values that are RegExp use test() for comparison.
 */
function deepEqual(expected, actual) {
  debug('deepEqual comparing', typeof expected, expected, typeof actual, actual)
  if (expected instanceof RegExp) {
    return expected.test(actual)
  }

  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) {
      return false
    }

    return expected.every((expVal, idx) => deepEqual(expVal, actual[idx]))
  }

  if (isPlainObject(expected) && isPlainObject(actual)) {
    const allKeys = Array.from(
      new Set(Object.keys(expected).concat(Object.keys(actual)))
    )

    return allKeys.every(key => deepEqual(expected[key], actual[key]))
  }

  return expected === actual
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 * https://github.com/lodash/lodash/blob/588bf3e20db0ae039a822a14a8fa238c5b298e65/isPlainObject.js
 *
 * @param {*} value The value to check.
 * @return {boolean}
 */
function isPlainObject(value) {
  const isObjectLike = typeof value === 'object' && value !== null
  const tag = Object.prototype.toString.call(value)
  if (!isObjectLike || tag !== '[object Object]') {
    return false
  }
  if (Object.getPrototypeOf(value) === null) {
    return true
  }
  let proto = value
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  return Object.getPrototypeOf(value) === proto
}

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. (iteration order is not guaranteed)
 * The iteratee is invoked with three arguments: (value, key, object).
 * https://github.com/lodash/lodash/blob/588bf3e20db0ae039a822a14a8fa238c5b298e65/mapValue.js
 *
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 */
function mapValue(object, iteratee) {
  object = Object(object)
  const result = {}

  Object.keys(object).forEach(key => {
    result[key] = iteratee(object[key], key, object)
  })
  return result
}

const timeouts = []
const intervals = []
const immediates = []

const wrapTimer = (timer, ids) => (...args) => {
  const id = timer(...args)
  ids.push(id)
  return id
}

const setTimeout = wrapTimer(timers.setTimeout, timeouts)
const setInterval = wrapTimer(timers.setInterval, intervals)
const setImmediate = wrapTimer(timers.setImmediate, immediates)

function clearTimer(clear, ids) {
  while (ids.length) {
    clear(ids.shift())
  }
}

function removeAllTimers() {
  clearTimer(clearTimeout, timeouts)
  clearTimer(clearInterval, intervals)
  clearTimer(clearImmediate, immediates)
}

module.exports = {
  contentEncoding,
  dataEqual,
  deleteHeadersField,
  forEachHeader,
  formatQueryValue,
  headersArrayToObject,
  headersFieldNamesToLowerCase,
  headersFieldsArrayToLowerCase,
  headersInputToRawArray,
  isContentEncoded,
  isJSONContent,
  isPlainObject,
  isStream,
  isUtf8Representable,
  mapValue,
  matchStringOrRegexp,
  normalizeClientRequestArgs,
  normalizeOrigin,
  normalizeRequestOptions,
  overrideRequests,
  percentDecode,
  percentEncode,
  removeAllTimers,
  restoreOverriddenRequests,
  setImmediate,
  setInterval,
  setTimeout,
  stringifyRequest,
}


/***/ }),
/* 18 */
/***/ ((module) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),
/* 19 */
/***/ ((module) => {

"use strict";
module.exports = require("timers");;

/***/ }),
/* 20 */
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),
/* 21 */
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),
/* 22 */
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * @module nock/intercept
 */

const { InterceptedRequestRouter } = __webpack_require__(24)
const common = __webpack_require__(17)
const { inherits } = __webpack_require__(12)
const http = __webpack_require__(21)
const debug = __webpack_require__(6)('nock.intercept')
const globalEmitter = __webpack_require__(26)

/**
 * @name NetConnectNotAllowedError
 * @private
 * @desc Error trying to make a connection when disabled external access.
 * @class
 * @example
 * nock.disableNetConnect();
 * http.get('http://zombo.com');
 * // throw NetConnectNotAllowedError
 */
function NetConnectNotAllowedError(host, path) {
  Error.call(this)

  this.name = 'NetConnectNotAllowedError'
  this.code = 'ENETUNREACH'
  this.message = `Nock: Disallowed net connect for "${host}${path}"`

  Error.captureStackTrace(this, this.constructor)
}

inherits(NetConnectNotAllowedError, Error)

let allInterceptors = {}
let allowNetConnect

/**
 * Enabled real request.
 * @public
 * @param {String|RegExp} matcher=RegExp.new('.*') Expression to match
 * @example
 * // Enables all real requests
 * nock.enableNetConnect();
 * @example
 * // Enables real requests for url that matches google
 * nock.enableNetConnect('google');
 * @example
 * // Enables real requests for url that matches google and amazon
 * nock.enableNetConnect(/(google|amazon)/);
 * @example
 * // Enables real requests for url that includes google
 * nock.enableNetConnect(host => host.includes('google'));
 */
function enableNetConnect(matcher) {
  if (typeof matcher === 'string') {
    allowNetConnect = new RegExp(matcher)
  } else if (matcher instanceof RegExp) {
    allowNetConnect = matcher
  } else if (typeof matcher === 'function') {
    allowNetConnect = { test: matcher }
  } else {
    allowNetConnect = /.*/
  }
}

function isEnabledForNetConnect(options) {
  common.normalizeRequestOptions(options)

  const enabled = allowNetConnect && allowNetConnect.test(options.host)
  debug('Net connect', enabled ? '' : 'not', 'enabled for', options.host)
  return enabled
}

/**
 * Disable all real requests.
 * @public
 * @example
 * nock.disableNetConnect();
 */
function disableNetConnect() {
  allowNetConnect = undefined
}

function isOn() {
  return !isOff()
}

function isOff() {
  return process.env.NOCK_OFF === 'true'
}

function addInterceptor(key, interceptor, scope, scopeOptions, host) {
  if (!(key in allInterceptors)) {
    allInterceptors[key] = { key, interceptors: [] }
  }
  interceptor.__nock_scope = scope

  //  We need scope's key and scope options for scope filtering function (if defined)
  interceptor.__nock_scopeKey = key
  interceptor.__nock_scopeOptions = scopeOptions
  //  We need scope's host for setting correct request headers for filtered scopes.
  interceptor.__nock_scopeHost = host
  interceptor.interceptionCounter = 0

  if (scopeOptions.allowUnmocked) allInterceptors[key].allowUnmocked = true

  allInterceptors[key].interceptors.push(interceptor)
}

function remove(interceptor) {
  if (interceptor.__nock_scope.shouldPersist() || --interceptor.counter > 0) {
    return
  }

  const { basePath } = interceptor
  const interceptors =
    (allInterceptors[basePath] && allInterceptors[basePath].interceptors) || []

  // TODO: There is a clearer way to write that we want to delete the first
  // matching instance. I'm also not sure why we couldn't delete _all_
  // matching instances.
  interceptors.some(function (thisInterceptor, i) {
    return thisInterceptor === interceptor ? interceptors.splice(i, 1) : false
  })
}

function removeAll() {
  Object.keys(allInterceptors).forEach(function (key) {
    allInterceptors[key].interceptors.forEach(function (interceptor) {
      interceptor.scope.keyedInterceptors = {}
    })
  })
  allInterceptors = {}
}

/**
 * Return all the Interceptors whose Scopes match against the base path of the provided options.
 *
 * @returns {Interceptor[]}
 */
function interceptorsFor(options) {
  common.normalizeRequestOptions(options)

  debug('interceptors for %j', options.host)

  const basePath = `${options.proto}://${options.host}`

  debug('filtering interceptors for basepath', basePath)

  // First try to use filteringScope if any of the interceptors has it defined.
  for (const { key, interceptors, allowUnmocked } of Object.values(
    allInterceptors
  )) {
    for (const interceptor of interceptors) {
      const { filteringScope } = interceptor.__nock_scopeOptions

      // If scope filtering function is defined and returns a truthy value then
      // we have to treat this as a match.
      if (filteringScope && filteringScope(basePath)) {
        interceptor.scope.logger('found matching scope interceptor')

        // Keep the filtered scope (its key) to signal the rest of the module
        // that this wasn't an exact but filtered match.
        interceptors.forEach(ic => {
          ic.__nock_filteredScope = ic.__nock_scopeKey
        })
        return interceptors
      }
    }

    if (common.matchStringOrRegexp(basePath, key)) {
      if (allowUnmocked && interceptors.length === 0) {
        debug('matched base path with allowUnmocked (no matching interceptors)')
        return [
          {
            options: { allowUnmocked: true },
            matchOrigin() {
              return false
            },
          },
        ]
      } else {
        debug(
          `matched base path (${interceptors.length} interceptor${
            interceptors.length > 1 ? 's' : ''
          })`
        )
        return interceptors
      }
    }
  }

  return undefined
}

function removeInterceptor(options) {
  // Lazily import to avoid circular imports.
  const Interceptor = __webpack_require__(32)

  let baseUrl, key, method, proto
  if (options instanceof Interceptor) {
    baseUrl = options.basePath
    key = options._key
  } else {
    proto = options.proto ? options.proto : 'http'

    common.normalizeRequestOptions(options)
    baseUrl = `${proto}://${options.host}`
    method = (options.method && options.method.toUpperCase()) || 'GET'
    key = `${method} ${baseUrl}${options.path || '/'}`
  }

  if (
    allInterceptors[baseUrl] &&
    allInterceptors[baseUrl].interceptors.length > 0
  ) {
    for (let i = 0; i < allInterceptors[baseUrl].interceptors.length; i++) {
      const interceptor = allInterceptors[baseUrl].interceptors[i]
      if (interceptor._key === key) {
        allInterceptors[baseUrl].interceptors.splice(i, 1)
        interceptor.scope.remove(key, interceptor)
        break
      }
    }

    return true
  }

  return false
}
//  Variable where we keep the ClientRequest we have overridden
//  (which might or might not be node's original http.ClientRequest)
let originalClientRequest

function ErroringClientRequest(error) {
  http.OutgoingMessage.call(this)
  process.nextTick(
    function () {
      this.emit('error', error)
    }.bind(this)
  )
}

inherits(ErroringClientRequest, http.ClientRequest)

function overrideClientRequest() {
  // Here's some background discussion about overriding ClientRequest:
  // - https://github.com/nodejitsu/mock-request/issues/4
  // - https://github.com/nock/nock/issues/26
  // It would be good to add a comment that explains this more clearly.
  debug('Overriding ClientRequest')

  // ----- Extending http.ClientRequest

  //  Define the overriding client request that nock uses internally.
  function OverriddenClientRequest(...args) {
    const { options, callback } = common.normalizeClientRequestArgs(...args)

    if (Object.keys(options).length === 0) {
      // As weird as it is, it's possible to call `http.request` without
      // options, and it makes a request to localhost or somesuch. We should
      // support it too, for parity. However it doesn't work today, and fixing
      // it seems low priority. Giving an explicit error is nicer than
      // crashing with a weird stack trace. `http[s].request()`, nock's other
      // client-facing entry point, makes a similar check.
      // https://github.com/nock/nock/pull/1386
      // https://github.com/nock/nock/pull/1440
      throw Error(
        'Creating a ClientRequest with empty `options` is not supported in Nock'
      )
    }

    http.OutgoingMessage.call(this)

    //  Filter the interceptors per request options.
    const interceptors = interceptorsFor(options)

    if (isOn() && interceptors) {
      debug('using', interceptors.length, 'interceptors')

      //  Use filtered interceptors to intercept requests.
      // TODO: this shouldn't be a class anymore
      // the overrider explicitly overrides methods and attrs on the request so the `assign` below should be removed.
      const overrider = new InterceptedRequestRouter({
        req: this,
        options,
        interceptors,
      })
      Object.assign(this, overrider)

      if (callback) {
        this.once('response', callback)
      }
    } else {
      debug('falling back to original ClientRequest')

      //  Fallback to original ClientRequest if nock is off or the net connection is enabled.
      if (isOff() || isEnabledForNetConnect(options)) {
        originalClientRequest.apply(this, arguments)
      } else {
        common.setImmediate(
          function () {
            const error = new NetConnectNotAllowedError(
              options.host,
              options.path
            )
            this.emit('error', error)
          }.bind(this)
        )
      }
    }
  }
  inherits(OverriddenClientRequest, http.ClientRequest)

  //  Override the http module's request but keep the original so that we can use it and later restore it.
  //  NOTE: We only override http.ClientRequest as https module also uses it.
  originalClientRequest = http.ClientRequest
  http.ClientRequest = OverriddenClientRequest

  debug('ClientRequest overridden')
}

function restoreOverriddenClientRequest() {
  debug('restoring overridden ClientRequest')

  //  Restore the ClientRequest we have overridden.
  if (!originalClientRequest) {
    debug('- ClientRequest was not overridden')
  } else {
    http.ClientRequest = originalClientRequest
    originalClientRequest = undefined

    debug('- ClientRequest restored')
  }
}

function isActive() {
  //  If ClientRequest has been overwritten by Nock then originalClientRequest is not undefined.
  //  This means that Nock has been activated.
  return originalClientRequest !== undefined
}

function interceptorScopes() {
  const nestedInterceptors = Object.values(allInterceptors).map(
    i => i.interceptors
  )
  return [].concat(...nestedInterceptors).map(i => i.scope)
}

function isDone() {
  return interceptorScopes().every(scope => scope.isDone())
}

function pendingMocks() {
  return [].concat(...interceptorScopes().map(scope => scope.pendingMocks()))
}

function activeMocks() {
  return [].concat(...interceptorScopes().map(scope => scope.activeMocks()))
}

function activate() {
  if (originalClientRequest) {
    throw new Error('Nock already active')
  }

  overrideClientRequest()

  // ----- Overriding http.request and https.request:

  common.overrideRequests(function (proto, overriddenRequest, args) {
    //  NOTE: overriddenRequest is already bound to its module.

    const { options, callback } = common.normalizeClientRequestArgs(...args)

    if (Object.keys(options).length === 0) {
      // As weird as it is, it's possible to call `http.request` without
      // options, and it makes a request to localhost or somesuch. We should
      // support it too, for parity. However it doesn't work today, and fixing
      // it seems low priority. Giving an explicit error is nicer than
      // crashing with a weird stack trace. `new ClientRequest()`, nock's
      // other client-facing entry point, makes a similar check.
      // https://github.com/nock/nock/pull/1386
      // https://github.com/nock/nock/pull/1440
      throw Error(
        'Making a request with empty `options` is not supported in Nock'
      )
    }

    // The option per the docs is `protocol`. Its unclear if this line is meant to override that and is misspelled or if
    // the intend is to explicitly keep track of which module was called using a separate name.
    // Either way, `proto` is used as the source of truth from here on out.
    options.proto = proto

    const interceptors = interceptorsFor(options)

    if (isOn() && interceptors) {
      const matches = interceptors.some(interceptor =>
        interceptor.matchOrigin(options)
      )
      const allowUnmocked = interceptors.some(
        interceptor => interceptor.options.allowUnmocked
      )

      if (!matches && allowUnmocked) {
        let req
        if (proto === 'https') {
          const { ClientRequest } = http
          http.ClientRequest = originalClientRequest
          req = overriddenRequest(options, callback)
          http.ClientRequest = ClientRequest
        } else {
          req = overriddenRequest(options, callback)
        }
        globalEmitter.emit('no match', req)
        return req
      }

      //  NOTE: Since we already overrode the http.ClientRequest we are in fact constructing
      //    our own OverriddenClientRequest.
      return new http.ClientRequest(options, callback)
    } else {
      globalEmitter.emit('no match', options)
      if (isOff() || isEnabledForNetConnect(options)) {
        return overriddenRequest(options, callback)
      } else {
        const error = new NetConnectNotAllowedError(options.host, options.path)
        return new ErroringClientRequest(error)
      }
    }
  })
}

module.exports = {
  addInterceptor,
  remove,
  removeAll,
  removeInterceptor,
  isOn,
  activate,
  isActive,
  isDone,
  pendingMocks,
  activeMocks,
  enableNetConnect,
  disableNetConnect,
  restoreOverriddenClientRequest,
  abortPendingRequests: common.removeAllTimers,
}


/***/ }),
/* 24 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const debug = __webpack_require__(6)('nock.request_overrider')
const {
  IncomingMessage,
  ClientRequest,
  request: originalHttpRequest,
} = __webpack_require__(21)
const { request: originalHttpsRequest } = __webpack_require__(22)
const propagate = __webpack_require__(25)
const common = __webpack_require__(17)
const globalEmitter = __webpack_require__(26)
const Socket = __webpack_require__(28)
const { playbackInterceptor } = __webpack_require__(29)

function socketOnClose(req) {
  debug('socket close')

  if (!req.res && !req.socket._hadError) {
    // If we don't have a response then we know that the socket
    // ended prematurely and we need to emit an error on the request.
    req.socket._hadError = true
    const err = new Error('socket hang up')
    err.code = 'ECONNRESET'
    req.emit('error', err)
  }
  req.emit('close')
}

/**
 * Given a group of interceptors, appropriately route an outgoing request.
 * Identify which interceptor ought to respond, if any, then delegate to
 * `playbackInterceptor()` to consume the request itself.
 */
class InterceptedRequestRouter {
  constructor({ req, options, interceptors }) {
    this.req = req
    this.options = {
      // We may be changing the options object and we don't want those changes
      // affecting the user so we use a clone of the object.
      ...options,
      // We use lower-case header field names throughout Nock.
      headers: common.headersFieldNamesToLowerCase(options.headers || {}),
    }
    this.interceptors = interceptors

    this.socket = new Socket(options)

    // support setting `timeout` using request `options`
    // https://nodejs.org/docs/latest-v12.x/api/http.html#http_http_request_url_options_callback
    if (options.timeout) {
      this.socket.setTimeout(options.timeout)
    }

    this.response = new IncomingMessage(this.socket)
    this.requestBodyBuffers = []
    this.playbackStarted = false

    // For parity with Node, it's important the socket event is emitted before we begin playback.
    // This flag is set when playback is triggered if we haven't yet gotten the
    // socket event to indicate that playback should start as soon as it comes in.
    this.readyToStartPlaybackOnSocketEvent = false

    this.attachToReq()

    // Emit a fake socket event on the next tick to mimic what would happen on a real request.
    // Some clients listen for a 'socket' event to be emitted before calling end(),
    // which causes Nock to hang.
    process.nextTick(() => this.connectSocket())
  }

  attachToReq() {
    const { req, options } = this

    for (const [name, val] of Object.entries(options.headers)) {
      req.setHeader(name.toLowerCase(), val)
    }

    if (options.auth && !options.headers.authorization) {
      req.setHeader(
        // We use lower-case header field names throughout Nock.
        'authorization',
        `Basic ${Buffer.from(options.auth).toString('base64')}`
      )
    }

    req.path = options.path
    req.method = options.method

    req.write = (...args) => this.handleWrite(...args)
    req.end = (...args) => this.handleEnd(...args)
    req.flushHeaders = (...args) => this.handleFlushHeaders(...args)

    // https://github.com/nock/nock/issues/256
    if (options.headers.expect === '100-continue') {
      common.setImmediate(() => {
        debug('continue')
        req.emit('continue')
      })
    }
  }

  connectSocket() {
    const { req, socket } = this

    // Until Node 14 is the minimum, we need to look at both flags to see if the request has been cancelled.
    if (req.destroyed || req.aborted) {
      return
    }

    // ClientRequest.connection is an alias for ClientRequest.socket
    // https://nodejs.org/api/http.html#http_request_socket
    // https://github.com/nodejs/node/blob/b0f75818f39ed4e6bd80eb7c4010c1daf5823ef7/lib/_http_client.js#L640-L641
    // The same Socket is shared between the request and response to mimic native behavior.
    req.socket = req.connection = socket

    propagate(['error', 'timeout'], socket, req)
    socket.on('close', () => socketOnClose(req))

    socket.connecting = false
    req.emit('socket', socket)

    // https://nodejs.org/api/net.html#net_event_connect
    socket.emit('connect')

    // https://nodejs.org/api/tls.html#tls_event_secureconnect
    if (socket.authorized) {
      socket.emit('secureConnect')
    }

    if (this.readyToStartPlaybackOnSocketEvent) {
      this.maybeStartPlayback()
    }
  }

  // from docs: When write function is called with empty string or buffer, it does nothing and waits for more input.
  // However, actually implementation checks the state of finished and aborted before checking if the first arg is empty.
  handleWrite(buffer, encoding, callback) {
    debug('request write')
    const { req } = this

    if (req.finished) {
      const err = new Error('write after end')
      err.code = 'ERR_STREAM_WRITE_AFTER_END'
      process.nextTick(() => req.emit('error', err))

      // It seems odd to return `true` here, not sure why you'd want to have
      // the stream potentially written to more, but it's what Node does.
      // https://github.com/nodejs/node/blob/a9270dcbeba4316b1e179b77ecb6c46af5aa8c20/lib/_http_outgoing.js#L662-L665
      return true
    }

    if (req.socket && req.socket.destroyed) {
      return false
    }

    if (!buffer || buffer.length === 0) {
      return true
    }

    if (!Buffer.isBuffer(buffer)) {
      buffer = Buffer.from(buffer, encoding)
    }
    this.requestBodyBuffers.push(buffer)

    // can't use instanceof Function because some test runners
    // run tests in vm.runInNewContext where Function is not same
    // as that in the current context
    // https://github.com/nock/nock/pull/1754#issuecomment-571531407
    if (typeof callback === 'function') {
      callback()
    }

    common.setImmediate(function () {
      req.emit('drain')
    })

    return false
  }

  handleEnd(chunk, encoding, callback) {
    debug('request end')
    const { req } = this

    // handle the different overloaded arg signatures
    if (typeof chunk === 'function') {
      callback = chunk
      chunk = null
    } else if (typeof encoding === 'function') {
      callback = encoding
      encoding = null
    }

    if (typeof callback === 'function') {
      req.once('finish', callback)
    }

    if (chunk) {
      req.write(chunk, encoding)
    }
    req.finished = true
    this.maybeStartPlayback()

    return req
  }

  handleFlushHeaders() {
    debug('request flushHeaders')
    this.maybeStartPlayback()
  }

  /**
   * Set request headers of the given request. This is needed both during the
   * routing phase, in case header filters were specified, and during the
   * interceptor-playback phase, to correctly pass mocked request headers.
   * TODO There are some problems with this; see https://github.com/nock/nock/issues/1718
   */
  setHostHeaderUsingInterceptor(interceptor) {
    const { req, options } = this

    // If a filtered scope is being used we have to use scope's host in the
    // header, otherwise 'host' header won't match.
    // NOTE: We use lower-case header field names throughout Nock.
    const HOST_HEADER = 'host'
    if (interceptor.__nock_filteredScope && interceptor.__nock_scopeHost) {
      options.headers[HOST_HEADER] = interceptor.__nock_scopeHost
      req.setHeader(HOST_HEADER, interceptor.__nock_scopeHost)
    } else {
      // For all other cases, we always add host header equal to the requested
      // host unless it was already defined.
      if (options.host && !req.getHeader(HOST_HEADER)) {
        let hostHeader = options.host

        if (options.port === 80 || options.port === 443) {
          hostHeader = hostHeader.split(':')[0]
        }

        req.setHeader(HOST_HEADER, hostHeader)
      }
    }
  }

  maybeStartPlayback() {
    const { req, socket, playbackStarted } = this

    // In order to get the events in the right order we need to delay playback
    // if we get here before the `socket` event is emitted.
    if (socket.connecting) {
      this.readyToStartPlaybackOnSocketEvent = true
      return
    }

    // Until Node 14 is the minimum, we need to look at both flags to see if the request has been cancelled.
    if (!req.destroyed && !req.aborted && !playbackStarted) {
      this.startPlayback()
    }
  }

  startPlayback() {
    debug('ending')
    this.playbackStarted = true

    const { req, response, socket, options, interceptors } = this

    Object.assign(options, {
      // Re-update `options` with the current value of `req.path` because badly
      // behaving agents like superagent like to change `req.path` mid-flight.
      path: req.path,
      // Similarly, node-http-proxy will modify headers in flight, so we have
      // to put the headers back into options.
      // https://github.com/nock/nock/pull/1484
      headers: req.getHeaders(),
      // Fixes https://github.com/nock/nock/issues/976
      protocol: `${options.proto}:`,
    })

    interceptors.forEach(interceptor => {
      this.setHostHeaderUsingInterceptor(interceptor)
    })

    const requestBodyBuffer = Buffer.concat(this.requestBodyBuffers)
    // When request body is a binary buffer we internally use in its hexadecimal
    // representation.
    const requestBodyIsUtf8Representable = common.isUtf8Representable(
      requestBodyBuffer
    )
    const requestBodyString = requestBodyBuffer.toString(
      requestBodyIsUtf8Representable ? 'utf8' : 'hex'
    )

    const matchedInterceptor = interceptors.find(i =>
      i.match(req, options, requestBodyString)
    )

    if (matchedInterceptor) {
      matchedInterceptor.scope.logger(
        'interceptor identified, starting mocking'
      )

      matchedInterceptor.markConsumed()

      // wait to emit the finish event until we know for sure an Interceptor is going to playback.
      // otherwise an unmocked request might emit finish twice.
      req.emit('finish')

      playbackInterceptor({
        req,
        socket,
        options,
        requestBodyString,
        requestBodyIsUtf8Representable,
        response,
        interceptor: matchedInterceptor,
      })
    } else {
      globalEmitter.emit('no match', req, options, requestBodyString)

      // Try to find a hostname match that allows unmocked.
      const allowUnmocked = interceptors.some(
        i => i.matchHostName(options) && i.options.allowUnmocked
      )

      if (allowUnmocked && req instanceof ClientRequest) {
        const newReq =
          options.proto === 'https'
            ? originalHttpsRequest(options)
            : originalHttpRequest(options)

        propagate(newReq, req)
        // We send the raw buffer as we received it, not as we interpreted it.
        newReq.end(requestBodyBuffer)
      } else {
        const reqStr = common.stringifyRequest(options, requestBodyString)
        const err = new Error(`Nock: No match for request ${reqStr}`)
        err.code = 'ERR_NOCK_NO_MATCH'
        err.statusCode = err.status = 404
        req.destroy(err)
      }
    }
  }
}

module.exports = { InterceptedRequestRouter }


/***/ }),
/* 25 */
/***/ ((module) => {

"use strict";


function propagate(events, source, dest) {
  if (arguments.length < 3) {
    dest = source
    source = events
    events = undefined
  }

  // events should be an array or object
  const eventsIsObject = typeof events === 'object'
  if (events && !eventsIsObject) events = [events]

  if (eventsIsObject) {
    return explicitPropagate(events, source, dest)
  }

  const shouldPropagate = eventName =>
    events === undefined || events.includes(eventName)

  const oldEmit = source.emit

  // Returns true if the event had listeners, false otherwise.
  // https://nodejs.org/api/events.html#events_emitter_emit_eventname_args
  source.emit = (eventName, ...args) => {
    const oldEmitHadListeners = oldEmit.call(source, eventName, ...args)

    let destEmitHadListeners = false
    if (shouldPropagate(eventName)) {
      destEmitHadListeners = dest.emit(eventName, ...args)
    }

    return oldEmitHadListeners || destEmitHadListeners
  }

  function end() {
    source.emit = oldEmit
  }

  return {
    end,
  }
}

module.exports = propagate

function explicitPropagate(events, source, dest) {
  let eventsIn
  let eventsOut
  if (Array.isArray(events)) {
    eventsIn = events
    eventsOut = events
  } else {
    eventsIn = Object.keys(events)
    eventsOut = eventsIn.map(function(key) {
      return events[key]
    })
  }

  const listeners = eventsOut.map(function(event) {
    return function() {
      const args = Array.prototype.slice.call(arguments)
      args.unshift(event)
      dest.emit.apply(dest, args)
    }
  })

  listeners.forEach(register)

  return {
    end,
  }

  function register(listener, i) {
    source.on(eventsIn[i], listener)
  }

  function unregister(listener, i) {
    source.removeListener(eventsIn[i], listener)
  }

  function end() {
    listeners.forEach(unregister)
  }
}


/***/ }),
/* 26 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { EventEmitter } = __webpack_require__(27)

module.exports = new EventEmitter()


/***/ }),
/* 27 */
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),
/* 28 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { EventEmitter } = __webpack_require__(27)
const debug = __webpack_require__(6)('nock.socket')

module.exports = class Socket extends EventEmitter {
  constructor(options) {
    super()

    if (options.proto === 'https') {
      // https://github.com/nock/nock/issues/158
      this.authorized = true
    }

    this.bufferSize = 0
    this.writableLength = 0
    this.writable = true
    this.readable = true
    this.pending = false
    this.destroyed = false
    this.connecting = true

    // Undocumented flag used by ClientRequest to ensure errors aren't double-fired
    this._hadError = false

    // Maximum allowed delay. 0 means unlimited.
    this.timeout = 0

    const ipv6 = options.family === 6
    this.remoteFamily = ipv6 ? 'IPv6' : 'IPv4'
    this.localAddress = this.remoteAddress = ipv6 ? '::1' : '127.0.0.1'
    this.localPort = this.remotePort = parseInt(options.port)
  }

  setNoDelay() {}
  setKeepAlive() {}
  resume() {}
  ref() {}
  unref() {}

  address() {
    return {
      port: this.remotePort,
      family: this.remoteFamily,
      address: this.remoteAddress,
    }
  }

  setTimeout(timeoutMs, fn) {
    this.timeout = timeoutMs
    if (fn) {
      this.once('timeout', fn)
    }
    return this
  }

  /**
   * Artificial delay that will trip socket timeouts when appropriate.
   *
   * Doesn't actually wait for time to pass.
   * Timeout events don't necessarily end the request.
   * While many clients choose to abort the request upon a timeout, Node itself does not.
   */
  applyDelay(delayMs) {
    if (this.timeout && delayMs > this.timeout) {
      debug('socket timeout')
      this.emit('timeout')
    }
  }

  getPeerCertificate() {
    return Buffer.from(
      (Math.random() * 10000 + Date.now()).toString()
    ).toString('base64')
  }

  /**
   * Denotes that no more I/O activity should happen on this socket.
   *
   * The implementation in Node if far more complex as it juggles underlying async streams.
   * For the purposes of Nock, we just need it to set some flags and on the first call
   * emit a 'close' and optional 'error' event. Both events propagate through the request object.
   */
  destroy(err) {
    if (this.destroyed) {
      return this
    }

    debug('socket destroy')
    this.destroyed = true
    this.readable = this.writable = false

    process.nextTick(() => {
      if (err) {
        this._hadError = true
        this.emit('error', err)
      }
      this.emit('close')
    })

    return this
  }
}


/***/ }),
/* 29 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const stream = __webpack_require__(30)
const util = __webpack_require__(12)
const zlib = __webpack_require__(31)
const debug = __webpack_require__(6)('nock.playback_interceptor')
const common = __webpack_require__(17)

function parseJSONRequestBody(req, requestBody) {
  if (!requestBody || !common.isJSONContent(req.headers)) {
    return requestBody
  }

  if (common.contentEncoding(req.headers, 'gzip')) {
    requestBody = String(zlib.gunzipSync(Buffer.from(requestBody, 'hex')))
  } else if (common.contentEncoding(req.headers, 'deflate')) {
    requestBody = String(zlib.inflateSync(Buffer.from(requestBody, 'hex')))
  }

  return JSON.parse(requestBody)
}

function parseFullReplyResult(response, fullReplyResult) {
  debug('full response from callback result: %j', fullReplyResult)

  if (!Array.isArray(fullReplyResult)) {
    throw Error('A single function provided to .reply MUST return an array')
  }

  if (fullReplyResult.length > 3) {
    throw Error(
      'The array returned from the .reply callback contains too many values'
    )
  }

  const [status, body = '', headers] = fullReplyResult

  if (!Number.isInteger(status)) {
    throw new Error(`Invalid ${typeof status} value for status code`)
  }

  response.statusCode = status
  response.rawHeaders.push(...common.headersInputToRawArray(headers))
  debug('response.rawHeaders after reply: %j', response.rawHeaders)

  return body
}

/**
 * Determine which of the default headers should be added to the response.
 *
 * Don't include any defaults whose case-insensitive keys are already on the response.
 */
function selectDefaultHeaders(existingHeaders, defaultHeaders) {
  if (!defaultHeaders.length) {
    return [] // return early if we don't need to bother
  }

  const definedHeaders = new Set()
  const result = []

  common.forEachHeader(existingHeaders, (_, fieldName) => {
    definedHeaders.add(fieldName.toLowerCase())
  })
  common.forEachHeader(defaultHeaders, (value, fieldName) => {
    if (!definedHeaders.has(fieldName.toLowerCase())) {
      result.push(fieldName, value)
    }
  })

  return result
}

// Presents a list of Buffers as a Readable
class ReadableBuffers extends stream.Readable {
  constructor(buffers, opts = {}) {
    super(opts)

    this.buffers = buffers
  }

  _read(size) {
    while (this.buffers.length) {
      if (!this.push(this.buffers.shift())) {
        return
      }
    }
    this.push(null)
  }
}

function convertBodyToStream(body) {
  if (common.isStream(body)) {
    return body
  }

  if (body === undefined) {
    return new ReadableBuffers([])
  }

  if (Buffer.isBuffer(body)) {
    return new ReadableBuffers([body])
  }

  if (typeof body !== 'string') {
    body = JSON.stringify(body)
  }

  return new ReadableBuffers([Buffer.from(body)])
}

/**
 * Play back an interceptor using the given request and mock response.
 */
function playbackInterceptor({
  req,
  socket,
  options,
  requestBodyString,
  requestBodyIsUtf8Representable,
  response,
  interceptor,
}) {
  const { logger } = interceptor.scope

  function start() {
    req.headers = req.getHeaders()

    interceptor.scope.emit('request', req, interceptor, requestBodyString)

    if (typeof interceptor.errorMessage !== 'undefined') {
      let error
      if (typeof interceptor.errorMessage === 'object') {
        error = interceptor.errorMessage
      } else {
        error = new Error(interceptor.errorMessage)
      }

      const delay = interceptor.delayBodyInMs + interceptor.delayConnectionInMs
      common.setTimeout(() => req.destroy(error), delay)
      return
    }

    // This will be null if we have a fullReplyFunction,
    // in that case status code will be set in `parseFullReplyResult`
    response.statusCode = interceptor.statusCode

    // Clone headers/rawHeaders to not override them when evaluating later
    response.rawHeaders = [...interceptor.rawHeaders]
    logger('response.rawHeaders:', response.rawHeaders)

    // TODO: MAJOR: Don't tack the request onto the interceptor.
    // The only reason we do this is so that it's available inside reply functions.
    // It would be better to pass the request as an argument to the functions instead.
    // Not adding the req as a third arg now because it should first be decided if (path, body, req)
    // is the signature we want to go with going forward.
    interceptor.req = req

    if (interceptor.replyFunction) {
      const parsedRequestBody = parseJSONRequestBody(req, requestBodyString)

      let fn = interceptor.replyFunction
      if (fn.length === 3) {
        // Handle the case of an async reply function, the third parameter being the callback.
        fn = util.promisify(fn)
      }

      // At this point `fn` is either a synchronous function or a promise-returning function;
      // wrapping in `Promise.resolve` makes it into a promise either way.
      Promise.resolve(fn.call(interceptor, options.path, parsedRequestBody))
        .then(continueWithResponseBody)
        .catch(err => req.destroy(err))
      return
    }

    if (interceptor.fullReplyFunction) {
      const parsedRequestBody = parseJSONRequestBody(req, requestBodyString)

      let fn = interceptor.fullReplyFunction
      if (fn.length === 3) {
        fn = util.promisify(fn)
      }

      Promise.resolve(fn.call(interceptor, options.path, parsedRequestBody))
        .then(continueWithFullResponse)
        .catch(err => req.destroy(err))
      return
    }

    if (
      common.isContentEncoded(interceptor.headers) &&
      !common.isStream(interceptor.body)
    ) {
      //  If the content is encoded we know that the response body *must* be an array
      //  of response buffers which should be mocked one by one.
      //  (otherwise decompressions after the first one fails as unzip expects to receive
      //  buffer by buffer and not one single merged buffer)
      const bufferData = Array.isArray(interceptor.body)
        ? interceptor.body
        : [interceptor.body]
      const responseBuffers = bufferData.map(data => Buffer.from(data, 'hex'))
      const responseBody = new ReadableBuffers(responseBuffers)
      continueWithResponseBody(responseBody)
      return
    }

    // If we get to this point, the body is either a string or an object that
    // will eventually be JSON stringified.
    let responseBody = interceptor.body

    // If the request was not UTF8-representable then we assume that the
    // response won't be either. In that case we send the response as a Buffer
    // object as that's what the client will expect.
    if (!requestBodyIsUtf8Representable && typeof responseBody === 'string') {
      // Try to create the buffer from the interceptor's body response as hex.
      responseBody = Buffer.from(responseBody, 'hex')

      // Creating buffers does not necessarily throw errors; check for difference in size.
      if (
        !responseBody ||
        (interceptor.body.length > 0 && responseBody.length === 0)
      ) {
        // We fallback on constructing buffer from utf8 representation of the body.
        responseBody = Buffer.from(interceptor.body, 'utf8')
      }
    }

    return continueWithResponseBody(responseBody)
  }

  function continueWithFullResponse(fullReplyResult) {
    let responseBody
    try {
      responseBody = parseFullReplyResult(response, fullReplyResult)
    } catch (err) {
      req.destroy(err)
      return
    }

    continueWithResponseBody(responseBody)
  }

  function prepareResponseHeaders(body) {
    const defaultHeaders = [...interceptor.scope._defaultReplyHeaders]

    // Include a JSON content type when JSON.stringify is called on the body.
    // This is a convenience added by Nock that has no analog in Node. It's added to the
    // defaults, so it will be ignored if the caller explicitly provided the header already.
    const isJSON =
      body !== undefined &&
      typeof body !== 'string' &&
      !Buffer.isBuffer(body) &&
      !common.isStream(body)

    if (isJSON) {
      defaultHeaders.push('Content-Type', 'application/json')
    }

    response.rawHeaders.push(
      ...selectDefaultHeaders(response.rawHeaders, defaultHeaders)
    )

    // Evaluate functional headers.
    common.forEachHeader(response.rawHeaders, (value, fieldName, i) => {
      if (typeof value === 'function') {
        response.rawHeaders[i + 1] = value(req, response, body)
      }
    })

    response.headers = common.headersArrayToObject(response.rawHeaders)
  }

  function continueWithResponseBody(rawBody) {
    prepareResponseHeaders(rawBody)
    const bodyAsStream = convertBodyToStream(rawBody)
    bodyAsStream.pause()

    // IncomingMessage extends Readable so we can't simply pipe.
    bodyAsStream.on('data', function (chunk) {
      response.push(chunk)
    })
    bodyAsStream.on('end', function () {
      // https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_message_complete
      response.complete = true
      response.push(null)

      interceptor.scope.emit('replied', req, interceptor)
    })
    bodyAsStream.on('error', function (err) {
      response.emit('error', err)
    })

    const { delayBodyInMs, delayConnectionInMs } = interceptor

    function respond() {
      if (req.aborted) {
        return
      }

      // Even though we've had the response object for awhile at this point,
      // we only attach it to the request immediately before the `response`
      // event because, as in Node, it alters the error handling around aborts.
      req.res = response
      response.req = req

      logger('emitting response')
      req.emit('response', response)

      common.setTimeout(() => bodyAsStream.resume(), delayBodyInMs)
    }

    socket.applyDelay(delayConnectionInMs)
    common.setTimeout(respond, delayConnectionInMs)
  }

  // Calling `start` immediately could take the request all the way to the connection delay
  // during a single microtask execution. This setImmediate stalls the playback to ensure the
  // correct events are emitted first ('socket', 'finish') and any aborts in the in the queue or
  // called during a 'finish' listener can be called.
  common.setImmediate(() => {
    if (!req.aborted) {
      start()
    }
  })
}

module.exports = { playbackInterceptor }


/***/ }),
/* 30 */
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),
/* 31 */
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ }),
/* 32 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const stringify = __webpack_require__(33)
const querystring = __webpack_require__(16)
const { URL, URLSearchParams } = __webpack_require__(20)

const common = __webpack_require__(17)
const { remove } = __webpack_require__(23)
const matchBody = __webpack_require__(34)

let fs
try {
  fs = __webpack_require__(35)
} catch (err) {
  // do nothing, we're in the browser
}

module.exports = class Interceptor {
  /**
   *
   * Valid argument types for `uri`:
   *  - A string used for strict comparisons with pathname.
   *    The search portion of the URI may also be postfixed, in which case the search params
   *    are striped and added via the `query` method.
   *  - A RegExp instance that tests against only the pathname of requests.
   *  - A synchronous function bound to this Interceptor instance. It's provided the pathname
   *    of requests and must return a boolean denoting if the request is considered a match.
   */
  constructor(scope, uri, method, requestBody, interceptorOptions) {
    const uriIsStr = typeof uri === 'string'
    // Check for leading slash. Uri can be either a string or a regexp, but
    // When enabled filteringScope ignores the passed URL entirely so we skip validation.

    if (
      !scope.scopeOptions.filteringScope &&
      uriIsStr &&
      !uri.startsWith('/') &&
      !uri.startsWith('*')
    ) {
      throw Error(
        `Non-wildcard URL path strings must begin with a slash (otherwise they won't match anything) (got: ${uri})`
      )
    }

    if (!method) {
      throw new Error(
        'The "method" parameter is required for an intercept call.'
      )
    }

    this.scope = scope
    this.interceptorMatchHeaders = []
    this.method = method.toUpperCase()
    this.uri = uri
    this._key = `${this.method} ${scope.basePath}${scope.basePathname}${
      uriIsStr ? '' : '/'
    }${uri}`
    this.basePath = this.scope.basePath
    this.path = uriIsStr ? scope.basePathname + uri : uri
    this.queries = null

    this.options = interceptorOptions || {}
    this.counter = 1
    this._requestBody = requestBody

    //  We use lower-case header field names throughout Nock.
    this.reqheaders = common.headersFieldNamesToLowerCase(
      scope.scopeOptions.reqheaders || {}
    )
    this.badheaders = common.headersFieldsArrayToLowerCase(
      scope.scopeOptions.badheaders || []
    )

    this.delayBodyInMs = 0
    this.delayConnectionInMs = 0

    this.optional = false

    // strip off literal query parameters if they were provided as part of the URI
    if (uriIsStr && uri.includes('?')) {
      // localhost is a dummy value because the URL constructor errors for only relative inputs
      const parsedURL = new URL(this.path, 'http://localhost')
      this.path = parsedURL.pathname
      this.query(parsedURL.searchParams)
      this._key = `${this.method} ${scope.basePath}${this.path}`
    }
  }

  optionally(flag = true) {
    // The default behaviour of optionally() with no arguments is to make the mock optional.
    if (typeof flag !== 'boolean') {
      throw new Error('Invalid arguments: argument should be a boolean')
    }

    this.optional = flag

    return this
  }

  replyWithError(errorMessage) {
    this.errorMessage = errorMessage

    this.options = {
      ...this.scope.scopeOptions,
      ...this.options,
    }

    this.scope.add(this._key, this)
    return this.scope
  }

  reply(statusCode, body, rawHeaders) {
    // support the format of only passing in a callback
    if (typeof statusCode === 'function') {
      if (arguments.length > 1) {
        // It's not very Javascript-y to throw an error for extra args to a function, but because
        // of legacy behavior, this error was added to reduce confusion for those migrating.
        throw Error(
          'Invalid arguments. When providing a function for the first argument, .reply does not accept other arguments.'
        )
      }
      this.statusCode = null
      this.fullReplyFunction = statusCode
    } else {
      if (statusCode !== undefined && !Number.isInteger(statusCode)) {
        throw new Error(`Invalid ${typeof statusCode} value for status code`)
      }

      this.statusCode = statusCode || 200
      if (typeof body === 'function') {
        this.replyFunction = body
        body = null
      }
    }

    this.options = {
      ...this.scope.scopeOptions,
      ...this.options,
    }

    this.rawHeaders = common.headersInputToRawArray(rawHeaders)

    if (this.scope.date) {
      // https://tools.ietf.org/html/rfc7231#section-7.1.1.2
      this.rawHeaders.push('Date', this.scope.date.toUTCString())
    }

    // Prepare the headers temporarily so we can make best guesses about content-encoding and content-type
    // below as well as while the response is being processed in RequestOverrider.end().
    // Including all the default headers is safe for our purposes because of the specific headers we introspect.
    // A more thoughtful process is used to merge the default headers when the response headers are finally computed.
    this.headers = common.headersArrayToObject(
      this.rawHeaders.concat(this.scope._defaultReplyHeaders)
    )

    //  If the content is not encoded we may need to transform the response body.
    //  Otherwise we leave it as it is.
    if (
      body &&
      typeof body !== 'string' &&
      !Buffer.isBuffer(body) &&
      !common.isStream(body) &&
      !common.isContentEncoded(this.headers)
    ) {
      try {
        body = stringify(body)
      } catch (err) {
        throw new Error('Error encoding response body into JSON')
      }

      if (!this.headers['content-type']) {
        // https://tools.ietf.org/html/rfc7231#section-3.1.1.5
        this.rawHeaders.push('Content-Type', 'application/json')
      }

      if (this.scope.contentLen) {
        // https://tools.ietf.org/html/rfc7230#section-3.3.2
        this.rawHeaders.push('Content-Length', body.length)
      }
    }

    this.scope.logger('reply.headers:', this.headers)
    this.scope.logger('reply.rawHeaders:', this.rawHeaders)

    this.body = body

    this.scope.add(this._key, this)
    return this.scope
  }

  replyWithFile(statusCode, filePath, headers) {
    if (!fs) {
      throw new Error('No fs')
    }
    const readStream = fs.createReadStream(filePath)
    readStream.pause()
    this.filePath = filePath
    return this.reply(statusCode, readStream, headers)
  }

  // Also match request headers
  // https://github.com/nock/nock/issues/163
  reqheaderMatches(options, key) {
    const reqHeader = this.reqheaders[key]
    let header = options.headers[key]

    // https://github.com/nock/nock/issues/399
    // https://github.com/nock/nock/issues/822
    if (header && typeof header !== 'string' && header.toString) {
      header = header.toString()
    }

    // We skip 'host' header comparison unless it's available in both mock and
    // actual request. This because 'host' may get inserted by Nock itself and
    // then get recorded. NOTE: We use lower-case header field names throughout
    // Nock. See https://github.com/nock/nock/pull/196.
    if (key === 'host' && (header === undefined || reqHeader === undefined)) {
      return true
    }

    if (reqHeader !== undefined && header !== undefined) {
      if (typeof reqHeader === 'function') {
        return reqHeader(header)
      } else if (common.matchStringOrRegexp(header, reqHeader)) {
        return true
      }
    }

    this.scope.logger(
      "request header field doesn't match:",
      key,
      header,
      reqHeader
    )
    return false
  }

  match(req, options, body) {
    // check if the logger is enabled because the stringifies can be expensive.
    if (this.scope.logger.enabled) {
      this.scope.logger(
        'attempting match %s, body = %s',
        stringify(options),
        stringify(body)
      )
    }

    const method = (options.method || 'GET').toUpperCase()
    let { path = '/' } = options
    let matches
    let matchKey
    const { proto } = options

    if (this.method !== method) {
      this.scope.logger(
        `Method did not match. Request ${method} Interceptor ${this.method}`
      )
      return false
    }

    if (this.scope.transformPathFunction) {
      path = this.scope.transformPathFunction(path)
    }

    const requestMatchesFilter = ({ name, value: predicate }) => {
      const headerValue = req.getHeader(name)
      if (typeof predicate === 'function') {
        return predicate(headerValue)
      } else {
        return common.matchStringOrRegexp(headerValue, predicate)
      }
    }

    if (
      !this.scope.matchHeaders.every(requestMatchesFilter) ||
      !this.interceptorMatchHeaders.every(requestMatchesFilter)
    ) {
      this.scope.logger("headers don't match")
      return false
    }

    const reqHeadersMatch = Object.keys(this.reqheaders).every(key =>
      this.reqheaderMatches(options, key)
    )

    if (!reqHeadersMatch) {
      this.scope.logger("headers don't match")
      return false
    }

    if (
      this.scope.scopeOptions.conditionally &&
      !this.scope.scopeOptions.conditionally()
    ) {
      this.scope.logger(
        'matching failed because Scope.conditionally() did not validate'
      )
      return false
    }

    const badHeaders = this.badheaders.filter(
      header => header in options.headers
    )

    if (badHeaders.length) {
      this.scope.logger('request contains bad headers', ...badHeaders)
      return false
    }

    // Match query strings when using query()
    if (this.queries === null) {
      this.scope.logger('query matching skipped')
    } else {
      // can't rely on pathname or search being in the options, but path has a default
      const [pathname, search] = path.split('?')
      const matchQueries = this.matchQuery({ search })

      this.scope.logger(
        matchQueries ? 'query matching succeeded' : 'query matching failed'
      )

      if (!matchQueries) {
        return false
      }

      // If the query string was explicitly checked then subsequent checks against
      // the path using a callback or regexp only validate the pathname.
      path = pathname
    }

    // If we have a filtered scope then we use it instead reconstructing the
    // scope from the request options (proto, host and port) as these two won't
    // necessarily match and we have to remove the scope that was matched (vs.
    // that was defined).
    if (this.__nock_filteredScope) {
      matchKey = this.__nock_filteredScope
    } else {
      matchKey = common.normalizeOrigin(proto, options.host, options.port)
    }

    if (typeof this.uri === 'function') {
      matches =
        common.matchStringOrRegexp(matchKey, this.basePath) &&
        // This is a false positive, as `uri` is not bound to `this`.
        // eslint-disable-next-line no-useless-call
        this.uri.call(this, path)
    } else {
      matches =
        common.matchStringOrRegexp(matchKey, this.basePath) &&
        common.matchStringOrRegexp(path, this.path)
    }

    this.scope.logger(`matching ${matchKey}${path} to ${this._key}: ${matches}`)

    if (matches && this._requestBody !== undefined) {
      if (this.scope.transformRequestBodyFunction) {
        body = this.scope.transformRequestBodyFunction(body, this._requestBody)
      }

      matches = matchBody(options, this._requestBody, body)
      if (!matches) {
        this.scope.logger(
          "bodies don't match: \n",
          this._requestBody,
          '\n',
          body
        )
      }
    }

    return matches
  }

  /**
   * Return true when the interceptor's method, protocol, host, port, and path
   * match the provided options.
   */
  matchOrigin(options) {
    const isPathFn = typeof this.path === 'function'
    const isRegex = this.path instanceof RegExp
    const isRegexBasePath = this.scope.basePath instanceof RegExp

    const method = (options.method || 'GET').toUpperCase()
    let { path } = options
    const { proto } = options

    // NOTE: Do not split off the query params as the regex could use them
    if (!isRegex) {
      path = path ? path.split('?')[0] : ''
    }

    if (this.scope.transformPathFunction) {
      path = this.scope.transformPathFunction(path)
    }
    const comparisonKey = isPathFn || isRegex ? this.__nock_scopeKey : this._key
    const matchKey = `${method} ${proto}://${options.host}${path}`

    if (isPathFn) {
      return !!(matchKey.match(comparisonKey) && this.path(path))
    }

    if (isRegex && !isRegexBasePath) {
      return !!matchKey.match(comparisonKey) && this.path.test(path)
    }

    if (isRegexBasePath) {
      return this.scope.basePath.test(matchKey) && !!path.match(this.path)
    }

    return comparisonKey === matchKey
  }

  matchHostName(options) {
    return options.hostname === this.scope.urlParts.hostname
  }

  matchQuery(options) {
    if (this.queries === true) {
      return true
    }

    const reqQueries = querystring.parse(options.search)
    this.scope.logger('Interceptor queries: %j', this.queries)
    this.scope.logger('    Request queries: %j', reqQueries)

    if (typeof this.queries === 'function') {
      return this.queries(reqQueries)
    }

    return common.dataEqual(this.queries, reqQueries)
  }

  filteringPath(...args) {
    this.scope.filteringPath(...args)
    return this
  }

  // TODO filtering by path is valid on the intercept level, but not filtering
  // by request body?

  markConsumed() {
    this.interceptionCounter++

    remove(this)

    if ((this.scope.shouldPersist() || this.counter > 0) && this.filePath) {
      this.body = fs.createReadStream(this.filePath)
      this.body.pause()
    }

    if (!this.scope.shouldPersist() && this.counter < 1) {
      this.scope.remove(this._key, this)
    }
  }

  matchHeader(name, value) {
    this.interceptorMatchHeaders.push({ name, value })
    return this
  }

  basicAuth({ user, pass = '' }) {
    const encoded = Buffer.from(`${user}:${pass}`).toString('base64')
    this.matchHeader('authorization', `Basic ${encoded}`)
    return this
  }

  /**
   * Set query strings for the interceptor
   * @name query
   * @param queries Object of query string name,values (accepts regexp values)
   * @public
   * @example
   * // Will match 'http://zombo.com/?q=t'
   * nock('http://zombo.com').get('/').query({q: 't'});
   */
  query(queries) {
    if (this.queries !== null) {
      throw Error(`Query parameters have already been defined`)
    }

    // Allow all query strings to match this route
    if (queries === true) {
      this.queries = queries
      return this
    }

    if (typeof queries === 'function') {
      this.queries = queries
      return this
    }

    let strFormattingFn
    if (this.scope.scopeOptions.encodedQueryParams) {
      strFormattingFn = common.percentDecode
    }

    if (queries instanceof URLSearchParams) {
      // Normalize the data into the shape that is matched against.
      // Duplicate keys are handled by combining the values into an array.
      queries = querystring.parse(queries.toString())
    } else if (!common.isPlainObject(queries)) {
      throw Error(`Argument Error: ${queries}`)
    }

    this.queries = {}
    for (const [key, value] of Object.entries(queries)) {
      const formatted = common.formatQueryValue(key, value, strFormattingFn)
      const [formattedKey, formattedValue] = formatted
      this.queries[formattedKey] = formattedValue
    }

    return this
  }

  /**
   * Set number of times will repeat the interceptor
   * @name times
   * @param newCounter Number of times to repeat (should be > 0)
   * @public
   * @example
   * // Will repeat mock 5 times for same king of request
   * nock('http://zombo.com).get('/').times(5).reply(200, 'Ok');
   */
  times(newCounter) {
    if (newCounter < 1) {
      return this
    }

    this.counter = newCounter

    return this
  }

  /**
   * An sugar syntax for times(1)
   * @name once
   * @see {@link times}
   * @public
   * @example
   * nock('http://zombo.com).get('/').once().reply(200, 'Ok');
   */
  once() {
    return this.times(1)
  }

  /**
   * An sugar syntax for times(2)
   * @name twice
   * @see {@link times}
   * @public
   * @example
   * nock('http://zombo.com).get('/').twice().reply(200, 'Ok');
   */
  twice() {
    return this.times(2)
  }

  /**
   * An sugar syntax for times(3).
   * @name thrice
   * @see {@link times}
   * @public
   * @example
   * nock('http://zombo.com).get('/').thrice().reply(200, 'Ok');
   */
  thrice() {
    return this.times(3)
  }

  /**
   * Delay the response by a certain number of ms.
   *
   * @param {(integer|object)} opts - Number of milliseconds to wait, or an object
   * @param {integer} [opts.head] - Number of milliseconds to wait before response is sent
   * @param {integer} [opts.body] - Number of milliseconds to wait before response body is sent
   * @return {Interceptor} - the current interceptor for chaining
   */
  delay(opts) {
    let headDelay
    let bodyDelay
    if (typeof opts === 'number') {
      headDelay = opts
      bodyDelay = 0
    } else if (typeof opts === 'object') {
      headDelay = opts.head || 0
      bodyDelay = opts.body || 0
    } else {
      throw new Error(`Unexpected input opts ${opts}`)
    }

    return this.delayConnection(headDelay).delayBody(bodyDelay)
  }

  /**
   * Delay the response body by a certain number of ms.
   *
   * @param {integer} ms - Number of milliseconds to wait before response is sent
   * @return {Interceptor} - the current interceptor for chaining
   */
  delayBody(ms) {
    this.delayBodyInMs = ms
    return this
  }

  /**
   * Delay the connection by a certain number of ms.
   *
   * @param  {integer} ms - Number of milliseconds to wait
   * @return {Interceptor} - the current interceptor for chaining
   */
  delayConnection(ms) {
    this.delayConnectionInMs = ms
    return this
  }
}


/***/ }),
/* 33 */
/***/ ((module, exports) => {

exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}


/***/ }),
/* 34 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const querystring = __webpack_require__(16)

const common = __webpack_require__(17)

module.exports = function matchBody(options, spec, body) {
  if (spec instanceof RegExp) {
    return spec.test(body)
  }

  if (Buffer.isBuffer(spec)) {
    const encoding = common.isUtf8Representable(spec) ? 'utf8' : 'hex'
    spec = spec.toString(encoding)
  }

  const contentType = (
    (options.headers &&
      (options.headers['Content-Type'] || options.headers['content-type'])) ||
    ''
  ).toString()

  const isMultipart = contentType.includes('multipart')
  const isUrlencoded = contentType.includes('application/x-www-form-urlencoded')

  // try to transform body to json
  let json
  if (typeof spec === 'object' || typeof spec === 'function') {
    try {
      json = JSON.parse(body)
    } catch (err) {
      // not a valid JSON string
    }
    if (json !== undefined) {
      body = json
    } else if (isUrlencoded) {
      body = querystring.parse(body)
    }
  }

  if (typeof spec === 'function') {
    return spec.call(options, body)
  }

  // strip line endings from both so that we get a match no matter what OS we are running on
  // if Content-Type does not contains 'multipart'
  if (!isMultipart && typeof body === 'string') {
    body = body.replace(/\r?\n|\r/g, '')
  }

  if (!isMultipart && typeof spec === 'string') {
    spec = spec.replace(/\r?\n|\r/g, '')
  }

  // Because the nature of URL encoding, all the values in the body have been cast to strings.
  // dataEqual does strict checking so we we have to cast the non-regexp values in the spec too.
  if (isUrlencoded) {
    spec = mapValuesDeep(spec, val => (val instanceof RegExp ? val : `${val}`))
  }

  return common.dataEqual(spec, body)
}

/**
 * Based on lodash issue discussion
 * https://github.com/lodash/lodash/issues/1244
 */
function mapValuesDeep(obj, cb) {
  if (Array.isArray(obj)) {
    return obj.map(v => mapValuesDeep(v, cb))
  }
  if (common.isPlainObject(obj)) {
    return common.mapValue(obj, v => mapValuesDeep(v, cb))
  }
  return cb(obj)
}


/***/ }),
/* 35 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),
/* 36 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * @module nock/scope
 */
const { addInterceptor, isOn } = __webpack_require__(23)
const common = __webpack_require__(17)
const assert = __webpack_require__(4)
const url = __webpack_require__(20)
const debug = __webpack_require__(6)('nock.scope')
const { EventEmitter } = __webpack_require__(27)
const Interceptor = __webpack_require__(32)

let fs

try {
  fs = __webpack_require__(35)
} catch (err) {
  // do nothing, we're in the browser
}

/**
 * @param  {string|RegExp|url.url} basePath
 * @param  {Object}   options
 * @param  {boolean}  options.allowUnmocked
 * @param  {string[]} options.badheaders
 * @param  {function} options.conditionally
 * @param  {boolean}  options.encodedQueryParams
 * @param  {function} options.filteringScope
 * @param  {Object}   options.reqheaders
 * @constructor
 */
class Scope extends EventEmitter {
  constructor(basePath, options) {
    super()

    this.keyedInterceptors = {}
    this.interceptors = []
    this.transformPathFunction = null
    this.transformRequestBodyFunction = null
    this.matchHeaders = []
    this.scopeOptions = options || {}
    this.urlParts = {}
    this._persist = false
    this.contentLen = false
    this.date = null
    this.basePath = basePath
    this.basePathname = ''
    this.port = null
    this._defaultReplyHeaders = []

    let logNamespace = String(basePath)

    if (!(basePath instanceof RegExp)) {
      this.urlParts = url.parse(basePath)
      this.port =
        this.urlParts.port || (this.urlParts.protocol === 'http:' ? 80 : 443)
      this.basePathname = this.urlParts.pathname.replace(/\/$/, '')
      this.basePath = `${this.urlParts.protocol}//${this.urlParts.hostname}:${this.port}`
      logNamespace = this.urlParts.host
    }

    this.logger = debug.extend(logNamespace)
  }

  add(key, interceptor) {
    if (!(key in this.keyedInterceptors)) {
      this.keyedInterceptors[key] = []
    }
    this.keyedInterceptors[key].push(interceptor)
    addInterceptor(
      this.basePath,
      interceptor,
      this,
      this.scopeOptions,
      this.urlParts.hostname
    )
  }

  remove(key, interceptor) {
    if (this._persist) {
      return
    }
    const arr = this.keyedInterceptors[key]
    if (arr) {
      arr.splice(arr.indexOf(interceptor), 1)
      if (arr.length === 0) {
        delete this.keyedInterceptors[key]
      }
    }
  }

  intercept(uri, method, requestBody, interceptorOptions) {
    const ic = new Interceptor(
      this,
      uri,
      method,
      requestBody,
      interceptorOptions
    )

    this.interceptors.push(ic)
    return ic
  }

  get(uri, requestBody, options) {
    return this.intercept(uri, 'GET', requestBody, options)
  }

  post(uri, requestBody, options) {
    return this.intercept(uri, 'POST', requestBody, options)
  }

  put(uri, requestBody, options) {
    return this.intercept(uri, 'PUT', requestBody, options)
  }

  head(uri, requestBody, options) {
    return this.intercept(uri, 'HEAD', requestBody, options)
  }

  patch(uri, requestBody, options) {
    return this.intercept(uri, 'PATCH', requestBody, options)
  }

  merge(uri, requestBody, options) {
    return this.intercept(uri, 'MERGE', requestBody, options)
  }

  delete(uri, requestBody, options) {
    return this.intercept(uri, 'DELETE', requestBody, options)
  }

  options(uri, requestBody, options) {
    return this.intercept(uri, 'OPTIONS', requestBody, options)
  }

  // Returns the list of keys for non-optional Interceptors that haven't been completed yet.
  // TODO: This assumes that completed mocks are removed from the keyedInterceptors list
  // (when persistence is off). We should change that (and this) in future.
  pendingMocks() {
    return this.activeMocks().filter(key =>
      this.keyedInterceptors[key].some(({ interceptionCounter, optional }) => {
        const persistedAndUsed = this._persist && interceptionCounter > 0
        return !persistedAndUsed && !optional
      })
    )
  }

  // Returns all keyedInterceptors that are active.
  // This includes incomplete interceptors, persisted but complete interceptors, and
  // optional interceptors, but not non-persisted and completed interceptors.
  activeMocks() {
    return Object.keys(this.keyedInterceptors)
  }

  isDone() {
    if (!isOn()) {
      return true
    }

    return this.pendingMocks().length === 0
  }

  done() {
    assert.ok(
      this.isDone(),
      `Mocks not yet satisfied:\n${this.pendingMocks().join('\n')}`
    )
  }

  buildFilter() {
    const filteringArguments = arguments

    if (arguments[0] instanceof RegExp) {
      return function (candidate) {
        /* istanbul ignore if */
        if (typeof candidate !== 'string') {
          // Given the way nock is written, it seems like `candidate` will always
          // be a string, regardless of what options might be passed to it.
          // However the code used to contain a truthiness test of `candidate`.
          // The check is being preserved for now.
          throw Error(
            `Nock internal assertion failed: typeof candidate is ${typeof candidate}. If you encounter this error, please report it as a bug.`
          )
        }
        return candidate.replace(filteringArguments[0], filteringArguments[1])
      }
    } else if (typeof arguments[0] === 'function') {
      return arguments[0]
    }
  }

  filteringPath() {
    this.transformPathFunction = this.buildFilter.apply(this, arguments)
    if (!this.transformPathFunction) {
      throw new Error(
        'Invalid arguments: filtering path should be a function or a regular expression'
      )
    }
    return this
  }

  filteringRequestBody() {
    this.transformRequestBodyFunction = this.buildFilter.apply(this, arguments)
    if (!this.transformRequestBodyFunction) {
      throw new Error(
        'Invalid arguments: filtering request body should be a function or a regular expression'
      )
    }
    return this
  }

  matchHeader(name, value) {
    //  We use lower-case header field names throughout Nock.
    this.matchHeaders.push({ name: name.toLowerCase(), value })
    return this
  }

  defaultReplyHeaders(headers) {
    this._defaultReplyHeaders = common.headersInputToRawArray(headers)
    return this
  }

  persist(flag = true) {
    if (typeof flag !== 'boolean') {
      throw new Error('Invalid arguments: argument should be a boolean')
    }
    this._persist = flag
    return this
  }

  /**
   * @private
   * @returns {boolean}
   */
  shouldPersist() {
    return this._persist
  }

  replyContentLength() {
    this.contentLen = true
    return this
  }

  replyDate(d) {
    this.date = d || new Date()
    return this
  }
}

function loadDefs(path) {
  if (!fs) {
    throw new Error('No fs')
  }

  const contents = fs.readFileSync(path)
  return JSON.parse(contents)
}

function load(path) {
  return define(loadDefs(path))
}

function getStatusFromDefinition(nockDef) {
  // Backward compatibility for when `status` was encoded as string in `reply`.
  if (nockDef.reply !== undefined) {
    const parsedReply = parseInt(nockDef.reply, 10)
    if (isNaN(parsedReply)) {
      throw Error('`reply`, when present, must be a numeric string')
    }

    return parsedReply
  }

  const DEFAULT_STATUS_OK = 200
  return nockDef.status || DEFAULT_STATUS_OK
}

function getScopeFromDefinition(nockDef) {
  //  Backward compatibility for when `port` was part of definition.
  if (nockDef.port !== undefined) {
    //  Include `port` into scope if it doesn't exist.
    const options = url.parse(nockDef.scope)
    if (options.port === null) {
      return `${nockDef.scope}:${nockDef.port}`
    } else {
      if (parseInt(options.port) !== parseInt(nockDef.port)) {
        throw new Error(
          'Mismatched port numbers in scope and port properties of nock definition.'
        )
      }
    }
  }

  return nockDef.scope
}

function tryJsonParse(string) {
  try {
    return JSON.parse(string)
  } catch (err) {
    return string
  }
}

function define(nockDefs) {
  const scopes = []

  nockDefs.forEach(function (nockDef) {
    const nscope = getScopeFromDefinition(nockDef)
    const npath = nockDef.path
    if (!nockDef.method) {
      throw Error('Method is required')
    }
    const method = nockDef.method.toLowerCase()
    const status = getStatusFromDefinition(nockDef)
    const rawHeaders = nockDef.rawHeaders || []
    const reqheaders = nockDef.reqheaders || {}
    const badheaders = nockDef.badheaders || []
    const options = { ...nockDef.options }

    //  We use request headers for both filtering (see below) and mocking.
    //  Here we are setting up mocked request headers but we don't want to
    //  be changing the user's options object so we clone it first.
    options.reqheaders = reqheaders
    options.badheaders = badheaders

    // Response is not always JSON as it could be a string or binary data or
    // even an array of binary buffers (e.g. when content is encoded).
    let response
    if (!nockDef.response) {
      response = ''
      // TODO: Rename `responseIsBinary` to `responseIsUtf8Representable`.
    } else if (nockDef.responseIsBinary) {
      response = Buffer.from(nockDef.response, 'hex')
    } else {
      response =
        typeof nockDef.response === 'string'
          ? tryJsonParse(nockDef.response)
          : nockDef.response
    }

    const scope = new Scope(nscope, options)

    // If request headers were specified filter by them.
    Object.entries(reqheaders).forEach(([fieldName, value]) => {
      scope.matchHeader(fieldName, value)
    })

    const acceptableFilters = ['filteringRequestBody', 'filteringPath']
    acceptableFilters.forEach(filter => {
      if (nockDef[filter]) {
        scope[filter](nockDef[filter])
      }
    })

    scope
      .intercept(npath, method, nockDef.body)
      .reply(status, response, rawHeaders)

    scopes.push(scope)
  })

  return scopes
}

module.exports = {
  Scope,
  load,
  loadDefs,
  define,
}


/***/ }),
/* 37 */
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),
/* 38 */
/***/ ((module, exports, __webpack_require__) => {

const nodeFetch = __webpack_require__(39)
const realFetch = nodeFetch.default || nodeFetch

const fetch = function (url, options) {
  // Support schemaless URIs on the server for parity with the browser.
  // Ex: //github.com/ -> https://github.com/
  if (/^\/\//.test(url)) {
    url = 'https:' + url
  }
  return realFetch.call(this, url, options)
}

fetch.ponyfill = true

module.exports = exports = fetch
exports.fetch = fetch
exports.Headers = nodeFetch.Headers
exports.Request = nodeFetch.Request
exports.Response = nodeFetch.Response

// Needed for TypeScript consumers without esModuleInterop.
exports.default = fetch


/***/ }),
/* 39 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__,
/* harmony export */   "Headers": () => /* binding */ Headers,
/* harmony export */   "Request": () => /* binding */ Request,
/* harmony export */   "Response": () => /* binding */ Response,
/* harmony export */   "FetchError": () => /* binding */ FetchError
/* harmony export */ });
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(20);
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(22);
/* harmony import */ var zlib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(31);






// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = stream__WEBPACK_IMPORTED_MODULE_0__.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = stream__WEBPACK_IMPORTED_MODULE_0__.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof stream__WEBPACK_IMPORTED_MODULE_0__)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__ && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http__WEBPACK_IMPORTED_MODULE_1__.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = url__WEBPACK_IMPORTED_MODULE_2__.parse;
const format_url = url__WEBPACK_IMPORTED_MODULE_2__.format;

const streamDestructionSupported = 'destroy' in stream__WEBPACK_IMPORTED_MODULE_0__.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof stream__WEBPACK_IMPORTED_MODULE_0__.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = stream__WEBPACK_IMPORTED_MODULE_0__.PassThrough;
const resolve_url = url__WEBPACK_IMPORTED_MODULE_2__.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__WEBPACK_IMPORTED_MODULE_3__ : http__WEBPACK_IMPORTED_MODULE_1__).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof stream__WEBPACK_IMPORTED_MODULE_0__.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib__WEBPACK_IMPORTED_MODULE_4__.Z_SYNC_FLUSH,
				finishFlush: zlib__WEBPACK_IMPORTED_MODULE_4__.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createInflate());
					} else {
						body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib__WEBPACK_IMPORTED_MODULE_4__.createBrotliDecompress === 'function') {
				body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fetch);



/***/ }),
/* 40 */
/***/ ((module) => {

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
  it('should use the polyfill fetch function', () => {
    expect(fetch.polyfill).to.equal(true)
    expect(fetch.ponyfill).to.equal(undefined)
  })
}

function addPonyfillSuite ({ fetch, defaultExport }) {
  it('should use the ponyfill fetch function', () => {
    expect(fetch.polyfill).to.equal(undefined)
    expect(fetch.ponyfill).to.equal(true)
  })

  it('should import the fetch function as the default', () => {
    expect(defaultExport).to.equal(fetch)
  })
}

function addNativeSuite ({ fetch }) {
  it('should use the native fetch function', () => {
    expect(fetch.polyfill).to.equal(undefined)
    expect(fetch.ponyfill).to.equal(undefined)
  })
}

module.exports = {
  addModuleSuite,
  addNativeSuite,
  addPolyfillSuite,
  addPonyfillSuite
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__(0);
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;