describe 'angularLocalStorage module', ->
    storage = null
    localStorage = null
    
    beforeEach ->
        module 'angularLocalStorage'

        inject ($injector) ->
            storage = $injector.get 'storage'
            storage.clearAll()

            localStorage = ($injector.get '$window').localStorage

    describe 'when use set() && get() methods', ->

        beforeEach ->
            storage.set('string', 'some test string')
            storage.set('emptyString', '')
            storage.set('object', { a: "one", b: 2 })
            storage.set('array', ['alpha', 2, { c: 'beta' }, false])
            storage.set('true', true)
            storage.set('false', false)
            storage.set('integer', 199)
            storage.set('double', 3.141592)
            storage.set('null', null)

        it 'should not allow setting a null key', ->
            expect(-> storage.set(null, 'value')).toThrow "Null keys are not permitted."

        it 'should store string values', ->
            expect(storage.get('string')).toEqual 'some test string'

        it 'should store empty string values', ->
            expect(storage.get('emptyString')).toEqual ''

        it 'should store object values', ->
            expect(storage.get('object')).toEqual { a: "one", b: 2 }

        it 'should store boolean values', ->
            expect(storage.get('true')).toEqual true
            expect(storage.get('false')).toEqual false

        it 'should store numerical values', ->
            expect(storage.get('integer')).toEqual 199
            expect(storage.get('double')).toEqual 3.141592

        it 'should store arrays', ->
            expect(storage.get('array')).toEqual ['alpha', 2, { c: 'beta' }, false]

        it 'should store null', ->
            expect(storage.get('null')).toBeNull()

        it 'should return null if not set', ->
            expect(storage.get('unknownKey')).toBeNull()

        it 'should allow overwriting existing key', ->
            value = 'some test string'
            storage.set('spec', value)
            testValue = storage.get('spec')
            expect(testValue).toEqual value

            value = 'another test string'
            storage.set('spec', value)
            testValue = storage.get('spec')
            expect(testValue).toEqual value 

        it 'should handle bad JSON parsing', ->
            value = '{ "key": true'
            localStorage.setItem('spec', value)

            actual = storage.get('spec')
            expect(actual).toEqual value
        
    describe 'when using get() with a default value', ->
        beforeEach ->
            storage.set('string', 'some test string')
            storage.set('null', null)
        

        it 'should return the default value for an unknown key', ->
            expect(storage.get('unknownKey', 'default Value')).toEqual 'default Value'
        

        it 'should return null if the default value is null', ->
            expect(storage.get('unknownKey', null)).toBeNull()
        

        it 'should return the default value for a null value', ->
            expect(storage.get('null', 'default Value')).toEqual 'default Value'
        

        it 'should return an object as the default value', ->
            defaultValue = { string: 'A String' }
            expect(storage.get('unknown Key', defaultValue)).toEqual defaultValue
        
    describe 'when using get() with a predicate', ->

        beforeEach ->
            storage.set('alpha-1', 'some test string')
            storage.set('alpha-2', 'another string')
            storage.set('beta-1', 'test string')
            storage.set('alpha-3', 'string value')
        
        it 'should return pairs that match the key predicate', ->
            pairs = storage.get (pair) -> pair.key.indexOf('alpha') == 0
            expect(pairs.length).toEqual 3
        
        it 'should return pairs that match the value predicate', ->
            pairs = storage.get (pair) -> pair.value.indexOf('value') > 0
            expect(pairs.length).toEqual 1
        
        it 'should return an empty array if nothing matches', ->
            pairs = storage.get (pair) -> false
            expect(pairs.length).toEqual 0

        it 'should return the default value if nothing matches and the defaultValue parameter is set', ->
            pairs = storage.get ((pair) -> false), 99
            expect(pairs).toEqual 99