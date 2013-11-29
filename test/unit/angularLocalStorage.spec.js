describe('angularLocalStorage module', function () {
    var storage, testValue, scope;

    beforeEach(function () {
        module('angularLocalStorage');

        inject(function ($injector) {
            storage = $injector.get('storage');

            storage.clearAll()
        });
    });

    describe('when using isSupported', function() {
        
        it('should return true', function() {
            expect(storage.isSupported()).toEqual(true);
        });
    });

    describe('when use set() && get() methods', function () {

        beforeEach(function () {
            storage.set('string', 'some test string');
            storage.set('emptyString', '');
            storage.set('object', { a: "one", b: 2 });
            storage.set('array', ['alpha', 2, { c: 'beta' }, false]);
            storage.set('true', true);
            storage.set('false', false);
            storage.set('integer', 199);
            storage.set('double', 3.141592);
            storage.set('null', null);
        });

        it('should not allow setting a null key', function() {
            
            expect(function() { storage.set(null, 'value'); }).toThrow("Null keys are not permitted.")
        });

        it('should store string values', function () {
            expect(storage.get('string')).toEqual('some test string');
        });

        it('should store empty string values', function () {
            expect(storage.get('emptyString')).toEqual('');
        });

        it('should store object values', function () {
            expect(storage.get('object')).toEqual({ a: "one", b: 2 });
        });

        it('should store boolean values', function () {
            expect(storage.get('true')).toEqual(true);
            expect(storage.get('false')).toEqual(false);
        });

        it('should store numerical values', function () {
            expect(storage.get('integer')).toEqual(199);
            expect(storage.get('double')).toEqual(3.141592);
        });

        it('should store arrays', function () {
            expect(storage.get('array')).toEqual(['alpha', 2, { c: 'beta' }, false]);
        });

        it('should store null', function () {
            expect(storage.get('null')).toBeNull();
        });

        it('should return null if not set', function() {
            expect(storage.get('unknownKey')).toBeNull();
        });

        it('should allow overwriting existing key', function() {
            var value = 'some test string';
            storage.set('spec', value);
            testValue = storage.get('spec');
            expect(testValue).toEqual(value);

            value = 'another test string';
            storage.set('spec', value);
            testValue = storage.get('spec');
            expect(testValue).toEqual(value);
        });
    });

    describe('when using get() with a default value', function() {
        beforeEach(function () {
            storage.set('string', 'some test string');
            storage.set('null', null);
        });

        it('should return the default value for an unknown key', function() {
            expect(storage.get('unknownKey', 'default Value')).toEqual('default Value');
        });

        it('should return null if the default value is null', function() {
            expect(storage.get('unknownKey', null)).toBeNull();
        });

        it('should return the default value for a null value', function() {
            expect(storage.get('null', 'default Value')).toEqual('default Value');
        });

        it('should return an object as the default value', function() {
            var defaultValue = { string: 'A String' };
            expect(storage.get('unknown Key', defaultValue)).toEqual(defaultValue);
        });
    });

    describe('when using initialize()', function() {
        beforeEach(function () {
            storage.set('string', 'some test string');
            storage.set('null', null);
        });

        it('should return the existing value for a known key', function() {
            expect(storage.initialize('string', 'initValue')).toEqual('some test string');
            expect(storage.get('string')).toEqual('some test string');
        });

        it('should return the new value for an unknown key', function() {
            expect(storage.initialize('unknownKey', 'initValue')).toEqual('initValue');
            expect(storage.get('unknownKey')).toEqual('initValue');
        });

        it('should handle initialize multiple times', function() {
            expect(storage.initialize('unknownKey', 'initValue')).toEqual('initValue');
            expect(storage.initialize('unknownKey', 'initValue2')).toEqual('initValue');
            expect(storage.initialize('unknownKey', 'initValue3')).toEqual('initValue');
            expect(storage.get('unknownKey')).toEqual('initValue');
        });
    });

    describe('when using increment()', function() {
        beforeEach(function () {
            storage.set('integer', 10);
            storage.set('float', 3.1);
            storage.set('string', 'some test string');
            storage.set('null', null);
        });

        it('should increment the existing integer value for a known key', function() {
            storage.increment('integer');
            expect(storage.get('integer')).toEqual(11);

            storage.increment('integer');
            storage.increment('integer');
            expect(storage.get('integer')).toEqual(13);
        });

        it('should increment the existing float value for a known key', function() {
            storage.increment('float');
            expect(storage.get('float')).toEqual(4.1);

            storage.increment('float');
            storage.increment('float');
            expect(storage.get('float')).toEqual(6.1);
        });

        it('should throw an exception if the value is a string', function() {
            expect(function() { storage.increment('string'); }).toThrow("Existing value is not a number.")
        });

        it('should initialize with the default value of 1 if the value is null', function() {
            storage.increment('null');
            expect(storage.get('null')).toEqual(1); 
        });

        it('should initialize with the default value of 1', function() {
            storage.increment('newValue');
            expect(storage.get('newValue')).toEqual(1);

            storage.increment('newValue');
            storage.increment('newValue');
            expect(storage.get('newValue')).toEqual(3);
        });

        it('should initialize with a custom default value of 10', function() {
            storage.increment('newValue', 10);
            expect(storage.get('newValue')).toEqual(10);

            storage.increment('newValue');
            storage.increment('newValue');
            expect(storage.get('newValue')).toEqual(12);
        });

        it('should increment by a custom amount', function() {
            storage.increment('newValue', 10, 10);
            expect(storage.get('newValue')).toEqual(10);

            storage.increment('newValue', 10, 10);
            storage.increment('newValue', 10, 10);
            expect(storage.get('newValue')).toEqual(30);
        });

        it('should increment by a negative amount', function() {
            storage.increment('newValue', 10, -1);
            expect(storage.get('newValue')).toEqual(10);

            storage.increment('newValue', 10, -1);
            storage.increment('newValue', 10, -1);
            expect(storage.get('newValue')).toEqual(8);
        });
    });

    describe('when using decrement()', function() {
        beforeEach(function () {
            storage.set('integer', 10);
            storage.set('float', 13.1);
            storage.set('string', 'some test string');
            storage.set('null', null);
        });

        it('should decrement the existing integer value for a known key', function() {
            storage.decrement('integer');
            expect(storage.get('integer')).toEqual(9);

            storage.decrement('integer');
            storage.decrement('integer');
            expect(storage.get('integer')).toEqual(7);
        });

        it('should decrement the existing float value for a known key', function() {
            storage.decrement('float');
            expect(storage.get('float')).toEqual(12.1);

            storage.decrement('float');
            storage.decrement('float');
            expect(storage.get('float')).toEqual(10.1);
        });

        it('should throw an exception if the value is a string', function() {
            expect(function() { storage.decrement('string'); }).toThrow("Existing value is not a number.")
        });

        it('should initialize with the default value of 0 if the value is null', function() {
            storage.decrement('null');
            expect(storage.get('null')).toEqual(0); 
        });

        it('should initialize with the default value of 0', function() {
            storage.decrement('newValue');
            expect(storage.get('newValue')).toEqual(0);

            storage.decrement('newValue');
            storage.decrement('newValue');
            expect(storage.get('newValue')).toEqual(-2);
        });

        it('should initialize with a custom default value of 10', function() {
            storage.decrement('newValue', 10);
            expect(storage.get('newValue')).toEqual(10);

            storage.decrement('newValue');
            storage.decrement('newValue');
            expect(storage.get('newValue')).toEqual(8);
        });

        it('should decrement by a custom amount', function() {
            storage.decrement('newValue', 50, 10);
            expect(storage.get('newValue')).toEqual(50);

            storage.decrement('newValue', 50, 10);
            storage.decrement('newValue', 50, 10);
            expect(storage.get('newValue')).toEqual(30);
        });

        it('should decrement by a negative amount', function() {
            storage.decrement('newValue', 10, -1);
            expect(storage.get('newValue')).toEqual(10);

            storage.decrement('newValue', 10, -1);
            storage.decrement('newValue', 10, -1);
            expect(storage.get('newValue')).toEqual(12);
        });
    });

    describe('when bind() $scope field to localStorage', function () {
        beforeEach(function () {
            inject(function ($rootScope) {
                scope = $rootScope.$new();

                scope.$apply(function () {
                    scope.spec = true;
                });

                storage.bind(scope, 'spec');

                scope.$apply(function () {
                    scope.spec = false;
                });
            });
        });

        beforeEach(function () {
            testValue = storage.get('spec');
        });

        it('should have $scope value', function () {
            expect(testValue).toEqual(scope.spec);
        });

        it('should not store undefined value', function () {
            scope.$apply(function () {
                scope.spec = undefined;
            });

            expect(testValue).toEqual(false);
            expect(scope.spec).toBeUndefined();
        });

        it('should store default value when passed as string', function() {
            scope.$apply(function(){
                storage.bind(scope,'defaultedSpec','someDefault');
            });
            expect(scope.defaultedSpec).toEqual('someDefault');
        });

        it('should store default value when passed as options object', function() {
            scope.$apply(function(){
                storage.bind(scope,'defaultedSpecObj',{defaultValue: 'someNewDefault'});
            });
            expect(scope.defaultedSpecObj).toEqual('someNewDefault');
        });

        it('using a custom storeName to bind variable', function() {
            scope.$apply(function(){
                storage.bind(scope,'customStored',{defaultValue: 'randomValue123' ,storeName: 'myCustomStore'});
                scope.directFromLocal = storage.get('myCustomStore');
            });
            expect(scope.customStored).toEqual('randomValue123');
            expect(scope.directFromLocal).toEqual('randomValue123');
        });
    });


    describe('when unbind() variable that clears localStorage and the variable', function () {
        var testLocalStorageValue, testLocalVariableValue;

        beforeEach(function () {
            storage.unbind(scope, 'spec');
        });

        beforeEach(function () {
            testLocalStorageValue = storage.get('spec');
            testLocalVariableValue = scope.spec;
        });

        it('should not contain field in storage', function () {
            expect(testLocalStorageValue).toBeNull();
        });

        it('should not contain field in scope', function () {
            expect(testLocalVariableValue).toBeNull();
        });
    });

    describe('when remove() field from localStorage', function () {

        beforeEach(function () {
            storage.clearAll();
            storage.set('key1', 'some test string');
            storage.set('key2', 'another test string');
            storage.set('object', { a: "one", b: 2 });
            storage.set('array', ['alpha', 2, { c: 'beta' }, false]);
            storage.set('true', true);
            storage.set('double', 3.141592);
        });

        it('should not contain string value', function () {
            var returnValue = storage.remove('key1');
            expect(returnValue).toBe(true);
            expect(storage.get('key1')).toBeNull();
            expect(storage.size()).toEqual(5);
        });

        it('should not contain object value', function () {
            var returnValue = storage.remove('object');
            expect(returnValue).toBe(true);
            expect(storage.get('object')).toBeNull();
            expect(storage.size()).toEqual(5);
        });

        it('should do nothing for unknown key', function () {
            var returnValue = storage.remove('unknownKey');
            expect(returnValue).toBe(true);
            expect(storage.size()).toEqual(6);
        });

        it('should do nothing for null key', function () {
            var returnValue = storage.remove(null);
            expect(returnValue).toBe(true);
            expect(storage.size()).toEqual(6);
        });
    });

    describe('when use clearAll() method all should be gone', function () {

        beforeEach(function () {
            storage.set('string', 'some test string');
            storage.set('object', { value: 'some object' });
            storage.set('number', 4.5);

            storage.clearAll();
        });

        it('should have a size of 0', function() {
            expect(storage.size()).toEqual(0);
        });

        it('should return null for value in localStorage', function () {
            expect(storage.get('string')).toBeNull();
            expect(storage.get('object')).toBeNull();
            expect(storage.get('number')).toBeNull();
        });
    });

    describe('when using getPairs()', function () {

        beforeEach(function () {
            storage.set('alpha-1', 'some test string');
            storage.set('alpha-2', 'another string');
            storage.set('beta-1', 'test string');
            storage.set('alpha-3', 'string value');
        });

        it('should return pairs that match the key predicate', function () {
            pairs = storage.getPairs(function (pair) { return pair.key.indexOf('alpha') === 0; });
            expect(pairs.length).toEqual(3);
        });

        it('should return pairs that match the value predicate', function () {
            pairs = storage.getPairs(function (pair) { return pair.value.indexOf('value') > 0; });
            expect(pairs.length).toEqual(1);
        });

        it('should return an empty array if nothing matches', function () {
            pairs = storage.getPairs(function (pair) { return false; });
            expect(pairs.length).toEqual(0);
        });
    });

    describe('when using removePairs()', function () {

        beforeEach(function () {
            storage.clearAll();
            storage.set('alpha-1', 'some test string');
            storage.set('alpha-2', 'another string');
            storage.set('beta-1', 'test string');
            storage.set('beta-2', 'test string');
            storage.set('alpha-3', 'string value');
        });

        it('should remove pairs that match the key predicate', function () {
            var count = storage.removePairs(function (pair) { return pair.key.indexOf('alpha') === 0; });
            expect(count).toEqual(3);

            expect(storage.size()).toEqual(2);
        });

        it('should remove pairs that match the value predicate', function () {
            var count = storage.removePairs(function (pair) { return pair.value.indexOf('value') > 0; });
            expect(count).toEqual(1);

            expect(storage.size()).toEqual(4);
        });

        it('should remove nothing if nothing matches', function () {
            var count = storage.removePairs(function (pair) { return false; });
            expect(count).toEqual(0);

            expect(storage.size()).toEqual(5);
        });
    });
});