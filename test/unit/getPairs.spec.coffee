describe 'angularLocalStorage module', ->
    storage = null
    
    beforeEach ->
        module 'angularLocalStorage'

        inject ($injector) ->
            storage = $injector.get 'storage'
            storage.clearAll()

    describe 'when using getPairs()', ->

        beforeEach ->
            storage.set('alpha-1', 'some test string')
            storage.set('alpha-2', 'another string')
            storage.set('beta-1', 'test string')
            storage.set('alpha-3', 'string value')
        
        it 'should return pairs that match the key predicate', ->
            pairs = storage.getPairs (pair) -> pair.key.indexOf('alpha') == 0
            expect(pairs.length).toEqual 3
        
        it 'should return pairs that match the value predicate', ->
            pairs = storage.getPairs (pair) -> pair.value.indexOf('value') > 0
            expect(pairs.length).toEqual 1
        
        it 'should return an empty array if nothing matches', ->
            pairs = storage.getPairs (pair) -> false
            expect(pairs.length).toEqual 0