# angularLocalStorage

This is a fully-featured AngularJS service for accessing [HTML5 localStorage](http://dev.w3.org/html5/webstorage/#storage-0).  It was forked from the excellent and lightweight implementation by agrublev, [angularLocalStorage](https://github.com/agrublev/angularLocalStorage).  This version implements additional commonly-used methods with the goal of reducing duplication within an AngularJS application.  It should be drop-in compatible with the original, with the exception that cookie backwards compatibility has been removed.


## Features:

* Two-way binding from $scope variables to a localStorage key/pair, which will be automatically updated whenever the model changes.
* Supports directly storing Objects, Arrays, Floats, Booleans, and Strings.  Automatically converts and deconverts on read/write.
* Predicate-based functions for querying/removing values from storage.

## Differences from the Original

* Implemented additional methods.
* Does not support cookie fallback.  I did not have time to implement it (and test it) across all the new methods, so it was removed.
* Rewritten in CoffeeScript.  It is also compiled to Javascript and minified, so either of the 3 versions can be used.


## How to use

1. Add the ``angularLocalStorage`` module to your app as a dependency:

        var yourApp = angular.module('yourApp', [..., 'angularLocalStorage']

2. Inject the ``storage`` service into your controllers:

        yourApp.controller('yourController', function($scope, storage) {

    or 
        
        yourApp.controller('yourController', ['$scope', 'storage', function($scope, storage) {

3. Use ``storage`` service
        ```
        /* Initialize a value if it doesn't exist */
        storage.initialize('currentPage', 'home');

        /* Get a value */
        $scope.currentPage = storage.get('currentPage');

        /* Set a value */
        storage.set('currentPage', 'search');

        /* Bind a value to the $scope */
        storage.bind($scope, 'currentPage');

        /* Bind a value to the $scope with options */
        storage.bind($scope, 'session', { defaultValue: {}, storeName: 'session-settings'});

        /* Increment a number, default value of 1 */
        storage.increment('pageHits', 1);

        /* Decrement a number */
        storage.decrement('quantity');

        /* Remove keys that start with "session-" */
        storage.remove(function (pair) { return pair.key.indexOf('session-') === 0; });


        /* Clear all values in localStorage */
        storage.clearAll();

        ```

## Suggestions?

Feel free to suggest ideas, improvements, or bugs.  Contributions welcome.

