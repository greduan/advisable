'use strict';

var Promise = require('bluebird');

module.exports = function (func) {
  var befores = [],
      afters = [],
      that = this;

  var advisableFunction = function () {
    var args = arguments;

    return Promise.resolve()
      .then(function () {
        return Promise.all(befores.map(function (beforeFunc) {
          return beforeFunc.apply(that, args);
        }));
      })
      .then(function () {
        return func.apply(that, args);
      })
      .then(function () {
        return Promise.all(afters.map(function (afterFunc) {
          return afterFunc.apply(that, args);
        }));
      });
  };

  Object.defineProperties(advisableFunction, {
    before: {
      get: function () {
        // beforeFunc should return a Promise
        return function (beforeFunc) {
          befores.push(beforeFunc);
        };
      },
    },

    after: {
      get: function () {
        // afterFunc should return a Promise
        return function (afterFunc) {
          afters.push(afterFunc);
        };
      },
    },
  });

  return advisableFunction;
};
