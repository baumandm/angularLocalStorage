(function() {
  angular.module('angularLocalStorage', []).factory('storage', [
    '$parse', '$window', function($parse, $window) {
      var privateMethods, publicMethods, storage, supported;
      storage = $window.localStorage != null ? $window.localStorage : null;
      supported = storage != null;
      privateMethods = {
        parseValue: function(res) {
          var error, val;
          try {
            val = angular.fromJson(res);
            if (val == null) {
              val = res;
            }
            if (val === 'true') {
              val = true;
            }
            if (val === 'false') {
              val = false;
            }
            if (val === 'null') {
              val = null;
            }
            if ($window.parseFloat(val) === val && !angular.isObject(val)) {
              val = $window.parseFloat(val);
            }
          } catch (_error) {
            error = _error;
            val = res;
          }
          return val;
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
        get: function(key, defaultValue) {
          var item, _ref;
          if (defaultValue == null) {
            defaultValue = null;
          }
          item = storage.getItem(key);
          return (_ref = privateMethods.parseValue(item)) != null ? _ref : defaultValue;
        },
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
        remove: function(key) {
          storage.removeItem(key);
          return true;
        },
        removePairs: function(predicate) {
          var pair, pairs, _fn, _i, _len;
          pairs = publicMethods.getPairs(predicate);
          _fn = function(pair) {
            return publicMethods.remove(pair.key);
          };
          for (_i = 0, _len = pairs.length; _i < _len; _i++) {
            pair = pairs[_i];
            _fn(pair);
          }
          return pairs.length;
        },
        bind: function($scope, key, opts) {
          var defaultOpts, storeName;
          defaultOpts = {
            defaultValue: '',
            storeName: ''
          };
          if (angular.isString(opts)) {
            opts = angular.extend({}, defaultOpts, {
              defaultValue: opts
            });
          } else {
            opts = angular.isUndefined(opts) ? defaultOpts : angular.extend(defaultOpts, opts);
          }
          storeName = opts.storeName || key;
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
          storeName = storeName || key;
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
