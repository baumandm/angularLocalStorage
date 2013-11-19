describe('angularLocalStorage module', function () {
    var storage, testValue, scope;

    beforeEach(function () {
        module('angularLocalStorage');

        inject(function ($injector) {
            storage = $injector.get('storage');
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
            storage.set(null, 'value');
            expect(storage.get(null)).toNotEqual('value');
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
        });

        it('should not contain object value', function () {
            var returnValue = storage.remove('object');
            expect(returnValue).toBe(true);
            expect(storage.get('object')).toBeNull();
        });

        it('should do nothing for unknown key', function () {
            var returnValue = storage.remove('unknownKey');
            expect(returnValue).toBe(true);
        });

        it('should do nothing for null key', function () {
            var returnValue = storage.remove(null);
            expect(returnValue).toBe(true);
        });
    });

    describe('when use clearAll() method all should be gone', function () {

        beforeEach(function () {
            storage.set('string', 'some test string');
            storage.set('object', { value: 'some object' });
            storage.set('number', 4.5);

            storage.clearAll();
        });

        it('should return null for value in localStorage', function () {
            expect(storage.get('string')).toBeNull();
            expect(storage.get('object')).toBeNull();
            expect(storage.get('number')).toBeNull();
        });
    });
});