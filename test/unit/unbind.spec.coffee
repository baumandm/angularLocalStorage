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
            scope.spec = true
            storage.unbind(scope, 'spec')

        it 'should not contain field in storage', ->
            expect(storage.get('spec')).toBeNull()

        it 'should not contain field in scope', ->
            expect(scope.spec).toBeNull()

    describe 'when unbind() non-existing variable', ->
        beforeEach ->
            storage.unbind(scope, 'unknown')

        it 'should not exist in storage', ->
            expect(storage.get('unknown')).toBeNull()

        it 'should not exist in scope', ->
            expect(scope.unknown).toBeNull()

    describe 'when unbind() with overloaded storeName', ->
        beforeEach ->
            scope.spec = true
            storage.set 'value', true
            storage.unbind(scope, 'spec', 'value')

        it 'should not exist in storage', ->
            expect(storage.get('value')).toBeNull()

        it 'should not exist in scope', ->
            expect(scope.spec).toBeNull()