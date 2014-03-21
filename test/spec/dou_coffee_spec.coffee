define [
  'dou'
], (
  dou
) ->

  "use strict"

  describe 'dou by coffee', ->

    it 'should define new component type', ->
      class Super

      mixin1 = ->
        @methodA = -> 'foo'
      mixin2 = ->
        @methodB = -> 'bar'

      Clazz = dou.define
        extend: Super
        mixins: [mixin1, mixin2]

      inst = new Clazz()

      expect(inst.methodA()).to.equal 'foo'
      expect(inst.methodB()).to.equal 'bar'

