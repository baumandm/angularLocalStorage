describe 'angularLocalStorage module', ->
    storage = null
    scope = null
    testValue = null
    
    beforeEach ->
        module 'angularLocalStorage'

        inject ($injector, $rootScope) ->
            storage = $injector.get 'storage'
            storage.clearAll()

            scope = $rootScope.$new()

    describe 'when unbind() variable that clears localStorage and the variable', ->

        beforeEach ->
            scope.spec = true;
            storage.unbind(scope, 'spec')

        it 'should not contain field in storage', ->
            testLocalStorageValue = storage.get('spec')
            expect(testLocalStorageValue).toBeNull()

        it 'should not contain field in scope', ->
            testLocalVariableValue = scope.spec
            expect(testLocalVariableValue).toBeNull()