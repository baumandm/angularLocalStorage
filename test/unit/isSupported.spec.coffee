describe 'angularLocalStorage module', ->
    storage = null
    
    beforeEach ->
        module 'angularLocalStorage'

        inject ($injector) ->
            storage = $injector.get 'storage'
            storage.clearAll()

    describe 'when using isSupported', ->
        
        it 'should return true', ->
            expect(storage.isSupported()).toEqual true