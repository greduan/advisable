# advisable

Just an idea for a package that I had, based on
[Aspect-oriented Programming][aop].

[aop]: https://en.wikipedia.org/wiki/Aspect-oriented_programming

Basically before executing a function you can tell the function first run a
bunch of other functions, or afterwards as well.

The before and after functions should be designed with Promises in mind, they
should return a Promise or some Promise-able value.

The main function you wrapped with advisable *can* return a Promise and be
treated appropriately, if not in Bluebird's eyes it is synchronous, because of
how Promises work, so be aware that if you fire an async process without
returning a Promise, the after functions will be executed because to Bluebird's
eyes that's a Promise resolved.

## Installation

ATM it's not published on NPM so you'll have to do it manually if you want to
use it in your projects.

```
$ git clone https://github.com/greduan/advisable.git
$ cd advisable
$ npm i
$ npm link
```

## Usage

```js
var ad = require('advisable');

var ourFunc = function (a, b) {
  // ...
};

var wrapped = ad(ourFunc);

// executed BEFORE original ourFunc
wrapped.before(function (a, b) {
  // please note it'll receive the same args as the original ourFunc
  // in this case a and b will be 1 and 2
  // ...
});

// same as .before except it executes AFTER the original ourFunc
wrapped.after(...);

// run, it'll run the .before and then the main func and then the .after
wrapped(1, 2); // a and b
```

## Tests

```
$ git clone https://github.com/greduan/advisable.git
$ cd advisable
$ npm i
$ npm test
```

## License

Licensed under the permissive ISC license.  Check the `LICENSE` file for further
details.
