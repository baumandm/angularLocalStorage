describe 'angularLocalStorage module', ->
    storage = null
    
    beforeEach ->
        module 'angularLocalStorage'

        inject ($injector) ->
            storage = $injector.get 'storage'
            storage.clearAll()

    describe 'when using initialize()', ->
        beforeEach ->
            storage.set('string', 'some test string')
            storage.set('null', null)


        it 'should return the existing value for a known key', ->
            expect(storage.initialize('string', 'initValue')).toEqual 'some test string'
            expect(storage.get('string')).toEqual 'some test string'


        it 'should return the new value for an unknown key', ->
            expect(storage.initialize('unknownKey', 'initValue')).toEqual 'initValue'
            expect(storage.get('unknownKey')).toEqual 'initValue'

        it 'should handle initialize multiple times', ->
            expect(storage.initialize('unknownKey', 'initValue')).toEqual 'initValue'
            expect(storage.initialize('unknownKey', 'initValue2')).toEqual 'initValue'
            expect(storage.initialize('unknownKey', 'initValue3')).toEqual 'initValue'
            expect(storage.get('unknownKey')).toEqual 'initValue'