angular.module('angularLocalStorage', [])
.factory 'storage', [
    '$parse', 
    '$window', 
    ($parse, $window) ->


        #
        # Global Vars
        #
        storage = if $window.localStorage? then $window.localStorage else null
        supported = storage?

        privateMethods =

            #
            # GetPairs - Returns an array of all key/value pairs for which the predicate function
            # returns true.  Each pair will be represented as {"key": key, "value": value}
            #
            # @param predicate - a function that accepts a key/value pair and returns true or false
            # @returns {array} - will return an array of values that passed the predicate test
            #
            getPairs: (predicate) ->
                result = []

                for i in [0..storage.length-1]
                    do (i) ->
                        key = storage.key(i)
                        pair = { key: key, value: publicMethods.get(key)}
                        if predicate(pair) then result.push pair

                return result

            #
            # Pass any type of a string from the localStorage to be parsed so it returns a 
            # usable version (like an Object).
            # Converts "true", "false", and "null" to booleans and null, respectively.
            #
            # @param res - a string that will be parsed for type
            # @returns {*} - whatever the real type of stored value was
            #
            parseValue: (res) ->
                try
                    val = angular.fromJson(res) ? res
                
                    val = switch val
                        when 'true' then true
                        when 'false' then false
                        when 'null' then null
                        else val
                    
                    float = $window.parseFloat val
                    if float == val and not angular.isObject(val)
                        val = float

                catch error
                    val = res

                return val

            #
            # RemovePairs - Removes all key/value pairs for which the predicate function
            # returns true.  Each pair will be represented as {"key": key, "value": value}
            #
            # @param predicate - a function that accepts a key/value pair and returns true or false
            # @returns {integer} - the number of pairs which were removed
            #
            removePairs: (predicate) ->
                pairs = privateMethods.getPairs(predicate)

                for pair in pairs
                    do (pair) ->
                        publicMethods.remove pair.key

                return pairs.length


        publicMethods = 

            isSupported: -> supported

            # 
            # Size - Gets the total number of key/value pairs in local Storage
            #
            # @returns {int} - returns the number of items in local Storage
            # 
            size: -> storage.length

            #
            # Set - Creates a new localStorage key-value pair
            #
            # @param key - a string that will be used as the accessor for the pair
            # @param value - the value of the localStorage item
            # @returns {*} - will return whatever it is you've stored in the local storage
            #
            set: (key, value) ->
                if not key?
                    throw 'Null keys are not permitted.'

                saver = angular.toJson(value)
                storage.setItem(key, saver)

                return privateMethods.parseValue(saver)

            #
            # Get - Returns the value of any key-value pair in localStorage, or if passed a function, 
            # an array containing all key/value pairs for which the predicate function returns true.
            #
            # If using a predicate and defaultValue, the defaultValue will be returned if the predicate 
            # returns false for all keys/value pairs in localStorage.  In other words, if defaultValue is set,
            # it will be returned instead of an empty array.
            #
            # @param keyOrFunction - the accessor value OR a predicate function
            # @param defaultValue - optionally returned if the key does not exist or its value is null
            # @returns {*} - Object,String,Float,Boolean depending on what you stored
            #
            get: (keyOrFunction, defaultValue = null) ->
                if typeof keyOrFunction == 'function'
                    pairs = privateMethods.getPairs(keyOrFunction)
                    if pairs.length == 0 && defaultValue? 
                        return defaultValue

                    return pairs
                    
                item = storage.getItem(keyOrFunction)

                return privateMethods.parseValue(item) ? defaultValue

            # Initialize - Stores a key-value pair unless the key is already in use
            #
            # @param key - a string that will be used as the accessor for the pair
            # @param value - the value of the localStorage item
            # @returns {*} - will return whatever value is stored in local storage for this key; either
            #                the existing value or the newly-initialized value
            initialize: (key, value) ->
                currentValue = publicMethods.get(key)
                if currentValue?
                    return currentValue

                publicMethods.set(key, value)


            # Increment - Increments a key's value by 1.  If it does not exist, it will be created
            # with the defaultValue, which defaults to 1.  The key will have the defaultValue after 
            # one call to increment(), while subsequent calls will increase the value further.
            #
            # Throws an exception if the existing value is not a numerical value.
            #
            # @param key - a string that will be used as the accessor for the pair
            # @param defaultValue - optional value to set if the key does not exist, defaults to 1
            # @param incrementBy - optional step amount for each increment, defautls to 1
            # @returns {*} - undefined
            #
            increment: (key, defaultValue = 1, incrementBy = 1) ->
                value = publicMethods.get(key)

                if not value?
                    storage.setItem(key, defaultValue)

                else
                    if typeof value != 'number' && toString.call(value) != '[object Number]'
                        throw 'Existing value is not a number.'

                    storage.setItem(key, value + incrementBy)

            # Decrement - Decrements a key's value by 1.  If it does not exist, it will be created
            # with the defaultValue, which defaults to 0.  The key will have the defaultValue after 
            # one call to decrement(), while subsequent calls will lower the value further.
            #
            # Throws an exception if the existing value is not a numerical value.
            #
            # @param key - a string that will be used as the accessor for the pair
            # @param defaultValue - optional value to set if the key does not exist, defaults to 0
            # @param incrementBy - optional step amount for each decrement, defautls to -1
            # @returns {*} - undefined
            #
            decrement: (key, defaultValue = 0, decrementBy = 1) ->
                publicMethods.increment key, defaultValue, -decrementBy

            #
            # Remove - Deletes a key-value pair from localStorage, or if passed a function, 
            # removes all key/value pairs for which the predicate function returns true.
            #
            # @param keyOrFunction - the accessor value OR a predicate function
            # @returns {boolean} - true unless an error occured.  If a predicate was provided, returns
            # the number of pairs which were removed
            #
            remove: (keyOrFunction) ->
                if typeof keyOrFunction == 'function'
                    return privateMethods.removePairs keyOrFunction

                storage.removeItem(keyOrFunction)
                return true

            #
            # Bind - let's you directly bind a localStorage value to a $scope variable
            # @param {Angular $scope} $scope - the current scope you want the variable available in
            # @param {String} key - the name of the variable you are binding
            # @param {Object} opts - (optional) custom options like default value or unique store name
            # Here are the available options you can set:
            # * defaultValue: the default value
            # * storeName: add a custom store key value instead of using the scope variable name
            # @returns {*} - returns whatever the stored value is
            #
            bind: ($scope, key, opts) ->
                defaultOpts =
                    defaultValue: ''
                    storeName: null

                # Backwards compatibility with old defaultValue string
                opts = switch
                    when angular.isString(opts) then angular.extend({}, defaultOpts, { defaultValue: opts })
                    when angular.isUndefined(opts) then defaultOpts
                    else angular.extend(defaultOpts, opts)

                # Set the storeName key for the localStorage entry
                # use user defined in specified
                storeName = opts.storeName ? key

                # If a value doesn't already exist store it as is
                publicMethods.initialize(storeName, opts.defaultValue)
                
                # If it does exist, assign it to the $scope value
                $parse(key).assign($scope, publicMethods.get(storeName))

                # Register a listener for changes on the $scope value
                # to update the localStorage value
                $scope.$watch(key, (val) ->
                    if angular.isDefined(val)
                        publicMethods.set(storeName, val)
                , true)

                return publicMethods.get(storeName)
            
            #
            # Unbind - let's you unbind a variable from localStorage while removing the value from both
            # the localStorage and the local variable and sets it to null
            #
            # @param $scope - the scope the variable was initially set in
            # @param key - the name of the variable you are unbinding
            # @param storeName - (optional) if you used a custom storeName you will have to specify it here as well
            #
            unbind: ($scope, key, storeName) ->
                storeName = storeName ? key
                $parse(key).assign($scope, null)
                $scope.$watch(key, -> )
                publicMethods.remove(storeName)

            #
            # Clear All - Removes all key/value pairs from local storage
            #
            clearAll: ->
                storage.clear()
        

        return publicMethods
]
