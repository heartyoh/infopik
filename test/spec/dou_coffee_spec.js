(function() {
  define(['dou'], function(dou) {
    "use strict";
    return describe('dou by coffee', function() {
      return it('should define new component type', function() {
        var Clazz, Super, inst, mixin1, mixin2;
        Super = (function() {
          function Super() {}

          return Super;

        })();
        mixin1 = function() {
          return this.methodA = function() {
            return 'foo';
          };
        };
        mixin2 = function() {
          return this.methodB = function() {
            return 'bar';
          };
        };
        Clazz = dou.define({
          extend: Super,
          mixins: [mixin1, mixin2]
        });
        inst = new Clazz();
        expect(inst.methodA()).to.equal('foo');
        return expect(inst.methodB()).to.equal('bar');
      });
    });
  });

}).call(this);
