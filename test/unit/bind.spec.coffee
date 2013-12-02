describe 'angularLocalStorage module', ->
    storage = null
    scope = null
    testValue = null
    
    beforeEach ->
        module 'angularLocalStorage'

        inject ($injector) ->
            storage = $injector.get 'storage'
            storage.clearAll()

    describe 'when bind() $scope field to localStorage', ->
        beforeEach ->
            inject ($rootScope) ->
                scope = $rootScope.$new()

                scope.$apply ->
                    scope.spec = true;

                storage.bind(scope, 'spec')

                scope.$apply ->
                    scope.spec = false

        beforeEach ->
            testValue = storage.get('spec')

        it 'should have $scope value', ->
            expect(testValue).toEqual scope.spec

        it 'should not store undefined value', ->
            scope.$apply ->
                scope.spec = undefined

            expect(testValue).toEqual false
            expect(scope.spec).toBeUndefined()


        it 'should store default value when passed as string', ->
            scope.$apply ->
                storage.bind(scope,'defaultedSpec','someDefault')
            
            expect(scope.defaultedSpec).toEqual 'someDefault'

        it 'should store default value when passed as options object', ->
            scope.$apply ->
                storage.bind(scope,'defaultedSpecObj', { defaultValue: 'someNewDefault' })

            expect(scope.defaultedSpecObj).toEqual 'someNewDefault'

        it 'using a custom storeName to bind variable', ->
            scope.$apply ->
                storage.bind(scope,'customStored', { defaultValue: 'randomValue123', storeName: 'myCustomStore' })
                scope.directFromLocal = storage.get('myCustomStore')

            expect(scope.customStored).toEqual 'randomValue123'
            expect(scope.directFromLocal).toEqual 'randomValue123'

