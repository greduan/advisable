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

    assert.equal(typeof res.before, 'function');
    assert.equal(typeof res.after, 'function');
  });

  it('Should return function which returns Promise when called', function () {
    var res = ad(function () {});

    var prom = res();

    assert.equal(typeof prom.then, 'function');
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
    var order = [];

    res.before(function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          order.push(1);

          resolve();
        }, 100);
      });
    });

    res.before(function () {
      order.push(2);

      return Promise.resolve();
    });

    return res()
      .then(function () {
        assert.deepEqual(order, [1, 2]);
      });
  });

  it('Should call .after functions in order', function () {
    var res = ad(function () {});
    var order = [];

    res.after(function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          order.push(1);

          resolve();
        }, 100);
      });
    });

    res.after(function () {
      order.push(2);

      return Promise.resolve();
    });

    return res()
      .then(function () {
        assert.deepEqual(order, [1, 2]);
      });
  });

  it('Should call .after functions AFTER .before functions', function () {
    var res = ad(function () {});
    var order = [];

    res.before(function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          order.push(1);

          resolve();
        }, 100);
      });
    });

    res.after(function () {
      order.push(2);

      return Promise.resolve();
    });

    return res()
      .then(function () {
        assert.deepEqual(order, [1, 2]);
      });
  });

});
