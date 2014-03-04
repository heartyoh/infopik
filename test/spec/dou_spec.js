"use strict";

define(['dou'], function (dou) {

  describe('dou', function () {

    it('should define new component type', function () {
      function Super() {
      }

      function mixin1() {
        this.methodA = function() { return 'foo'; };
      }

      function mixin2() {
        this.methodB = function() { return 'bar'; };
      }

      var Clazz = dou.define({
        extend : Super,
        mixins : [mixin1, mixin2]
      });

      var inst = new Clazz();

      expect(inst.methodA()).to.equal('foo');
      expect(inst.methodB()).to.equal('bar');
    });

  });

});

