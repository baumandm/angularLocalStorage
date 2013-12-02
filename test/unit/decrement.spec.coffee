describe 'angularLocalStorage module', ->
    storage = null
    
    beforeEach ->
        module 'angularLocalStorage'

        inject ($injector) ->
            storage = $injector.get 'storage'
            storage.clearAll()

    describe 'when using decrement()', ->
        beforeEach ->
            storage.set('integer', 10)
            storage.set('float', 13.1)
            storage.set('string', 'some test string')
            storage.set('null', null)

        it 'should decrement the existing integer value for a known key', ->
            storage.decrement('integer')
            expect(storage.get('integer')).toEqual 9

            storage.decrement('integer')
            storage.decrement('integer')
            expect(storage.get('integer')).toEqual 7

        it 'should decrement the existing float value for a known key', ->
            storage.decrement('float')
            expect(storage.get('float')).toEqual 12.1

            storage.decrement('float')
            storage.decrement('float')
            expect(storage.get('float')).toEqual 10.1

        it 'should throw an exception if the value is a string', ->
            expect(-> storage.decrement('string')).toThrow "Existing value is not a number."

        it 'should initialize with the default value of 0 if the value is null', ->
            storage.decrement('null')
            expect(storage.get('null')).toEqual 0

        it 'should initialize with the default value of 0', ->
            storage.decrement('newValue')
            expect(storage.get('newValue')).toEqual 0

            storage.decrement('newValue')
            storage.decrement('newValue')
            expect(storage.get('newValue')).toEqual -2

        it 'should initialize with a custom default value of 10', ->
            storage.decrement('newValue', 10)
            expect(storage.get('newValue')).toEqual 10

            storage.decrement('newValue')
            storage.decrement('newValue')
            expect(storage.get('newValue')).toEqual 8

        it 'should decrement by a custom amount', ->
            storage.decrement('newValue', 50, 10)
            expect(storage.get('newValue')).toEqual 50

            storage.decrement('newValue', 50, 10)
            storage.decrement('newValue', 50, 10)
            expect(storage.get('newValue')).toEqual 30

        it 'should decrement by a negative amount', ->
            storage.decrement('newValue', 10, -1)
            expect(storage.get('newValue')).toEqual 10

            storage.decrement('newValue', 10, -1)
            storage.decrement('newValue', 10, -1)
            expect(storage.get('newValue')).toEqual 12