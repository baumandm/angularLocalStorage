describe 'angularLocalStorage module', ->
    storage = null
    
    beforeEach ->
        module 'angularLocalStorage'

        inject ($injector) ->
            storage = $injector.get 'storage'
            storage.clearAll()

    describe 'when remove() field from localStorage', ->

        beforeEach ->
            storage.clearAll()
            storage.set('key1', 'some test string')
            storage.set('key2', 'another test string')
            storage.set('object', { a: "one", b: 2 })
            storage.set('array', ['alpha', 2, { c: 'beta' }, false])
            storage.set('true', true)
            storage.set('double', 3.141592)

        it 'should not contain string value', ->
            returnValue = storage.remove('key1')
            expect(returnValue).toBe true
            expect(storage.get('key1')).toBeNull()
            expect(storage.size()).toEqual 5

        it 'should not contain object value', ->
            returnValue = storage.remove('object')
            expect(returnValue).toBe true
            expect(storage.get('object')).toBeNull()
            expect(storage.size()).toEqual 5

        it 'should do nothing for unknown key', ->
            returnValue = storage.remove('unknownKey')
            expect(returnValue).toBe true
            expect(storage.size()).toEqual 6

        it 'should do nothing for null key', ->
            returnValue = storage.remove(null)
            expect(returnValue).toBe true
            expect(storage.size()).toEqual 6

    describe 'when using remove() with a predicate', ->

        beforeEach ->
            storage.clearAll()
            storage.set('alpha-1', 'some test string')
            storage.set('alpha-2', 'another string')
            storage.set('beta-1', 'test string')
            storage.set('beta-2', 'test string')
            storage.set('alpha-3', 'string value')

        it 'should remove pairs that match the key predicate', ->
            removedCount = storage.remove (pair) -> pair.key.indexOf('alpha') == 0
            expect(removedCount).toEqual 3

            expect(storage.size()).toEqual 2

        it 'should remove pairs that match the value predicate', ->
            removedCount = storage.remove (pair) -> pair.value.indexOf('value') > 0
            expect(removedCount).toEqual 1

            expect(storage.size()).toEqual 4

        it 'should remove nothing if nothing matches', ->
            removedCount = storage.remove (pair) -> false
            expect(removedCount).toEqual 0

            expect(storage.size()).toEqual 5