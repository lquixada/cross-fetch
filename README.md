cross-fetch
[![Build Status](https://travis-ci.org/lquixada/cross-fetch.svg?branch=master)](https://travis-ci.org/lquixada/cross-fetch)
[![NPM Version](https://img.shields.io/npm/v/cross-fetch.svg?branch=master)](https://www.npmjs.com/package/cross-fetch)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
================

Universal WHATWG Fetch API for Node, Browsers and React Native. The scenario that cross-fetch really shines is when the same javascript codebase needs to run on different platforms.

* * *

## Installation

```sh
npm install --save cross-fetch
```

As a [ponyfill](https://github.com/sindresorhus/ponyfill):

```javascript
// Using ES6 modules
import { fetch } from 'cross-fetch';

// Using CommonJS modules
const { fetch } = require('cross-fetch');
```

As a polyfill:

```javascript
// Using ES6 modules
import 'cross-fetch/polyfill';

// Using CommonJS modules
require('cross-fetch/polyfill');
```

* * *

## Usage

As a [ponyfill](https://github.com/sindresorhus/ponyfill):

```javascript
const { fetch } = require('cross-fetch');

fetch('//api.github.com/users/lquixada')
  .then(res => {
    if (res.status >= 400) {
      throw new Error("Bad response from server");
    }
    return res.json();
  })
  .then(user => {
    console.log(user);
  });
```

As a polyfill:

```javascript
require('cross-fetch');

fetch('//api.github.com/users/lquixada')
  .then(res => {
    if (res.status >= 400) {
      throw new Error("Bad response from server");
    }
    return res.json();
  })
  .then(user => {
    console.log(user);
  });
```

> ⚠️ **Warning**: If you're in an environment that doesn't support Promises such as Internet Explorer, you must install an ES6 Promise compatible polyfill. [es6-promise](https://github.com/jakearchibald/es6-promise) is suggested.


## API

You can find a comprehensive doc at [Github's fetch](https://github.github.io/fetch/) page.


## FAQ

#### Yet another fetch library?

I did a lot of research in order to find a fetch library that could meet theses criterias:

- [x] Simple import / require (no configuration required)
- [x] Platform agnostic (client, server or react native)
- [x] Optional polyfill (it's up to you if something is going to be added to the global object or not)

There's a plethora of libs out there but none could match those. My preferred library used to be [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) but it has this [issue](https://github.com/matthew-andrews/isomorphic-fetch/issues/125) with react native. Also, polyfilling is mandatory.


#### How does it work?

cross-fetch (like isomorphic-fetch) is just a proxy. If you're in node, it delivers you the [node-fetch](https://www.npmjs.com/package/node-fetch) library, if you're in a browser ou React Native, it delivers you the github's [whatwg-fetch](https://github.com/github/fetch/). The same strategy applies if you're using polyfill or ponyfill.


## Suported environments

* Node 4+
* React-Native
* Browsers
  - Chrome
  - Firefox
  - Safari 6.1+
  - Internet Explorer 10+


## Thanks

Heavily inspired by the works of [matthew-andrews](https://github.com/matthew-andrews). Kudos to him!


## License

cross-fetch is licenced under the [MIT licence](https://github.com/lquixada/cross-fetch/blob/master/LICENSE).
