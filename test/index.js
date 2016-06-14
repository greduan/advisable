'use strict';

var assert = require('assert');
var td = require('testdouble');

var ad = require('..');

describe('advisable', function () {

  it('Should return a function', function () {
    assert.equal(typeof ad(function () {}), 'function');
  });

  it('Should return function with functions .before and .after', function () {
    var res = ad(function () {});

    assert(typeof ad.before, 'function');
    assert(typeof ad.after, 'function');
  });

  it('Should return function which returns Promise when called', function () {
    var res = ad(function () {});

    var prom = res();

    assert(typeof res.then, 'function');
  });

  it('Should call functions passed to .before', function () {
    var res = ad(function () {});
    var d = td.function();

    res.before(d);

    res();

    return res()
      .then(function () {
        td.verify(d());
      });
  });

  it('Should call functions passed to .after', function () {
    var res = ad(function () {});
    var d = td.function();

    res.after(d);

    return res()
      .then(function () {
        td.verify(d());
      });
  });

  it('Should call functions passed to .before with args passed to returned function', function () {
    var res = ad(function () {});
    var d = td.function();

    res.before(function (a, b) {
      d(a, b);
    });

    res(1, 2);

    return res(1, 2)
      .then(function () {
        td.verify(d(1, 2));
      });
  });

  it('Should call functions passed to .after with args passed to returned function', function () {
    var res = ad(function () {});
    var d = td.function();

    res.after(function (a, b) {
      d(a, b);
    });

    return res(1, 2)
      .then(function () {
        td.verify(d(1, 2));
      });
  });

  it('Should call .before functions in order', function () {
    var res = ad(function () {});
    var d = td.function();

    res.before(function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          d('one');

          resolve();
        }, 100);
      });
    });

    res.before(function () {
      d('two');

      return Promise.resolve();
    });

    return res()
      .then(function () {
        // TODO: Doesn't properly test for order
        td.verify(d('one'));
        td.verify(d('two'));
      });
  });

  it('Should call .after functions in order', function () {
    var res = ad(function () {});
    var d = td.function();

    res.after(function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          d('one');

          resolve();
        }, 100);
      });
    });

    res.after(function () {
      d('two');

      return Promise.resolve();
    });

    return res()
      .then(function () {
        // TODO: Doesn't properly test for order
        td.verify(d('one'));
        td.verify(d('two'));
      });
  });

  it('Should call .after functions AFTER .before functions', function () {
    var res = ad(function () {});
    var d = td.function();

    res.before(function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          d('one');

          resolve();
        }, 100);
      });
    });

    res.after(function () {
      d('two');

      return Promise.resolve();
    });

    return res()
      .then(function () {
        // TODO: Doesn't properly test for order
        td.verify(d('one'));
        td.verify(d('two'));
      });
  });

});
