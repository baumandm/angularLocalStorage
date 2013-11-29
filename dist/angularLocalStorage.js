/**
 * AngularJS service providing HTML5 local storage support
 * @version v0.1.0 - 2013-11-29
 * @link https://github.com/baumandm/angularLocalStorage
 * @author Dave Bauman <baumandm@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function() {
  angular.module('angularLocalStorage', ['ngCookies']).factory('storage', [
    '$parse', '$cookieStore', '$window', '$log', function($parse, $cookieStore, $window, $log) {
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
        size: function() {
          return storage.length;
        },
        set: function(key, value) {
          var error, saver;
          if (key == null) {
            return $log.log('Null keys are not permitted');
          }
          if (!supported) {
            try {
              $cookieStore.put(key, value);
              return value;
            } catch (_error) {
              error = _error;
              return $log.log('Local Storage not supported, make sure you have angular-cookies enabled.');
            }
          }
          saver = angular.toJson(value);
          storage.setItem(key, saver);
          return privateMethods.parseValue(saver);
        },
        get: function(key, defaultValue) {
          var error, item, _ref;
          if (defaultValue == null) {
            defaultValue = null;
          }
          if (!supported) {
            try {
              return privateMethods.parseValue($.cookie(key));
            } catch (_error) {
              error = _error;
              return null;
            }
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
        remove: function(key) {
          var error;
          if (!supported) {
            try {
              $cookieStore.remove(key);
              return true;
            } catch (_error) {
              error = _error;
              return false;
            }
          }
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
