(function() {
  angular.module('angularLocalStorage', []).factory('storage', [
    '$parse', '$window', function($parse, $window) {
      var privateMethods, publicMethods, storage, supported;
      storage = $window.localStorage != null ? $window.localStorage : null;
      supported = storage != null;
      privateMethods = {
        getPairs: function(predicate) {
          var i, result, _fn, _i, _ref;
          result = [];
          _fn = function(i) {
            var key, pair;
            key = storage.key(i);
            pair = {
              key: key,
              value: publicMethods.get(key)
            };
            if (predicate(pair)) {
              return result.push(pair);
            }
          };
          for (i = _i = 0, _ref = storage.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            _fn(i);
          }
          return result;
        },
        parseValue: function(res) {
          var error, float, val, _ref;
          try {
            val = (_ref = angular.fromJson(res)) != null ? _ref : res;
            val = (function() {
              switch (val) {
                case 'true':
                  return true;
                case 'false':
                  return false;
                case 'null':
                  return null;
                default:
                  return val;
              }
            })();
            float = $window.parseFloat(val);
            if (float === val && !angular.isObject(val)) {
              val = float;
            }
          } catch (_error) {
            error = _error;
            val = res;
          }
          return val;
        },
        removePairs: function(predicate) {
          var pair, pairs, _fn, _i, _len;
          pairs = privateMethods.getPairs(predicate);
          _fn = function(pair) {
            return publicMethods.remove(pair.key);
          };
          for (_i = 0, _len = pairs.length; _i < _len; _i++) {
            pair = pairs[_i];
            _fn(pair);
          }
          return pairs.length;
        }
      };
      publicMethods = {
        isSupported: function() {
          return supported;
        },
        size: function() {
          return storage.length;
        },
        set: function(key, value) {
          var saver;
          if (key == null) {
            throw 'Null keys are not permitted.';
          }
          saver = angular.toJson(value);
          storage.setItem(key, saver);
          return privateMethods.parseValue(saver);
        },
        get: function(keyOrFunction, defaultValue) {
          var item, pairs, _ref;
          if (defaultValue == null) {
            defaultValue = null;
          }
          if (typeof keyOrFunction === 'function') {
            pairs = privateMethods.getPairs(keyOrFunction);
            if (pairs.length === 0 && (defaultValue != null)) {
              return defaultValue;
            }
            return pairs;
          }
          item = storage.getItem(keyOrFunction);
          return (_ref = privateMethods.parseValue(item)) != null ? _ref : defaultValue;
        },
        initialize: function(key, value) {
          var currentValue;
          currentValue = publicMethods.get(key);
          if (currentValue != null) {
            return currentValue;
          }
          return publicMethods.set(key, value);
        },
        increment: function(key, defaultValue, incrementBy) {
          var value;
          if (defaultValue == null) {
            defaultValue = 1;
          }
          if (incrementBy == null) {
            incrementBy = 1;
          }
          value = publicMethods.get(key);
          if (value == null) {
            return storage.setItem(key, defaultValue);
          } else {
            if (typeof value !== 'number' && toString.call(value) !== '[object Number]') {
              throw 'Existing value is not a number.';
            }
            return storage.setItem(key, value + incrementBy);
          }
        },
        decrement: function(key, defaultValue, decrementBy) {
          if (defaultValue == null) {
            defaultValue = 0;
          }
          if (decrementBy == null) {
            decrementBy = 1;
          }
          return publicMethods.increment(key, defaultValue, -decrementBy);
        },
        remove: function(keyOrFunction) {
          if (typeof keyOrFunction === 'function') {
            return privateMethods.removePairs(keyOrFunction);
          }
          storage.removeItem(keyOrFunction);
          return true;
        },
        bind: function($scope, key, opts) {
          var defaultOpts, storeName, _ref;
          defaultOpts = {
            defaultValue: '',
            storeName: null
          };
          opts = (function() {
            switch (false) {
              case !angular.isString(opts):
                return angular.extend({}, defaultOpts, {
                  defaultValue: opts
                });
              case !angular.isUndefined(opts):
                return defaultOpts;
              default:
                return angular.extend(defaultOpts, opts);
            }
          })();
          storeName = (_ref = opts.storeName) != null ? _ref : key;
          publicMethods.initialize(storeName, opts.defaultValue);
          $parse(key).assign($scope, publicMethods.get(storeName));
          $scope.$watch(key, function(val) {
            if (angular.isDefined(val)) {
              return publicMethods.set(storeName, val);
            }
          }, true);
          return publicMethods.get(storeName);
        },
        unbind: function($scope, key, storeName) {
          storeName = storeName != null ? storeName : key;
          $parse(key).assign($scope, null);
          $scope.$watch(key, function() {});
          return publicMethods.remove(storeName);
        },
        clearAll: function() {
          return storage.clear();
        }
      };
      return publicMethods;
    }
  ]);

}).call(this);
