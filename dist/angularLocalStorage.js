/**
 * AngularJS service providing HTML5 local storage support
 * @version v0.1.0 - 2013-11-18
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
        set: function(key, value) {
          var error, saver;
          if (!supported) {
            try {
              $cookieStore.put(key, value);
              return value;
            } catch (_error) {
              error = _error;
              $log.log('Local Storage not supported, make sure you have angular-cookies enabled.');
            }
          }
          saver = angular.toJson(value);
          storage.setItem(key, saver);
          return privateMethods.parseValue(saver);
        },
        get: function(key) {
          var error, item;
          if (!supported) {
            try {
              return privateMethods.parseValue($.cookie(key));
            } catch (_error) {
              error = _error;
              return null;
            }
          }
          item = storage.getItem(key);
          return privateMethods.parseValue(item);
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
          if (!publicMethods.get(storeName)) {
            publicMethods.set(storeName, opts.defaultValue);
          }
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
