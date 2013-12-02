describe 'angularLocalStorage module', ->
    storage = null
    
    beforeEach ->
        module 'angularLocalStorage'

        inject ($injector) ->
            storage = $injector.get 'storage'
            storage.clearAll()

    describe 'when use clearAll() method all should be gone', ->

        beforeEach ->
            storage.set('string', 'some test string')
            storage.set('object', { value: 'some object' })
            storage.set('number', 4.5)

            storage.clearAll()

        it 'should have a size of 0', ->
            expect(storage.size()).toEqual 0

        it 'should return null for value in localStorage', ->
            expect(storage.get('string')).toBeNull()
            expect(storage.get('object')).toBeNull()
            expect(storage.get('number')).toBeNull()
