'use strict';

var Promise = require('bluebird');

module.exports = function (func) {
  var befores = [],
    afters = [];

  var advisableFunction = function () {
    var args = arguments;

    var that = this;

    return Promise.resolve()
      .then(function () {
        return Promise.each(befores, function (beforeFunc) {
          return beforeFunc.apply(that, args);
        });
      })
      .then(function () {
        return func.apply(that, args);
      })
      .then(function () {
        return Promise.each(afters, function (afterFunc) {
          return afterFunc.apply(that, args);
        });
      });
  };

  Object.defineProperties(advisableFunction, {
    before: {
      get: function () {
        // beforeFunc should be aware it's being treated as a Promise
        return function (beforeFunc) {
          befores.push(beforeFunc);
        };
      },
    },

    after: {
      get: function () {
        // afterFunc should be aware it's being treated as a Promise
        return function (afterFunc) {
          afters.push(afterFunc);
        };
      },
    },
  });

  return advisableFunction;
};
