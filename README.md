# advisable

Just an idea for a package that I had, based on
[Aspect-oriented Programming][aop].

[aop]: https://en.wikipedia.org/wiki/Aspect-oriented_programming

Basically before executing a function you can tell the function first run a
bunch of other functions or afterwards as well.

Please note that this is a wrapper, and since the before and after functions can
be async, even if your original function doesn't, this'll make it return a
Bluebird promise.

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

// executed before original ourFunc
wrapped.before(function (a, b) {
  // please note it'll receive the same args as the original ourFunc
  // ...
});

// same as .before except it runs after the original ourFunc
wrapped.after(...);

// run, it'll run the .before and then the main func and then the .after
wrapped(1, 2);
```

## License

Licensed under the permissive ISC license.  Check the `LICENSE` file for further
details.
