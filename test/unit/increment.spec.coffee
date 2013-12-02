describe 'angularLocalStorage module', ->
    storage = null
    
    beforeEach ->
        module 'angularLocalStorage'

        inject ($injector) ->
            storage = $injector.get 'storage'
            storage.clearAll()

    describe 'when using increment()', ->
        beforeEach ->
            storage.set('integer', 10)
            storage.set('float', 3.1)
            storage.set('string', 'some test string')
            storage.set('null', null)

        it 'should increment the existing integer value for a known key', ->
            storage.increment('integer')
            expect(storage.get('integer')).toEqual 11

            storage.increment('integer')
            storage.increment('integer')
            expect(storage.get('integer')).toEqual 13

        it 'should increment the existing float value for a known key', ->
            storage.increment('float')
            expect(storage.get('float')).toEqual 4.1

            storage.increment('float')
            storage.increment('float')
            expect(storage.get('float')).toEqual 6.1

        it 'should throw an exception if the value is a string', ->
            expect(-> storage.increment('string')).toThrow "Existing value is not a number."

        it 'should initialize with the default value of 1 if the value is null', ->
            storage.increment('null')
            expect(storage.get('null')).toEqual 1

        it 'should initialize with the default value of 1', ->
            storage.increment('newValue')
            expect(storage.get('newValue')).toEqual 1

            storage.increment('newValue')
            storage.increment('newValue')
            expect(storage.get('newValue')).toEqual 3

        it 'should initialize with a custom default value of 10', ->
            storage.increment('newValue', 10)
            expect(storage.get('newValue')).toEqual 10

            storage.increment('newValue')
            storage.increment('newValue')
            expect(storage.get('newValue')).toEqual 12

        it 'should increment by a custom amount', ->
            storage.increment('newValue', 10, 10)
            expect(storage.get('newValue')).toEqual 10

            storage.increment('newValue', 10, 10)
            storage.increment('newValue', 10, 10)
            expect(storage.get('newValue')).toEqual 30

        it 'should increment by a negative amount', ->
            storage.increment('newValue', 10, -1)
            expect(storage.get('newValue')).toEqual 10

            storage.increment('newValue', 10, -1)
            storage.increment('newValue', 10, -1)
            expect(storage.get('newValue')).toEqual 8