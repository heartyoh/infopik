"use strict";

define(['dou', 'src/Containable'], function (dou, Containable) {

  describe('(Mixin) Containable', function () {

    describe('initialize', function() {

      it('should make components container for the mixined object', function () {
        var Container = dou.define({
            mixins : Containable
        });
        
        var inst = new Container();

        inst.initialize({});
        inst.add('a');

        inst.select().length.should.equal(1);
      });
    });

    describe('add', function() {

      it('should be able to accept a component or a array of components', function () {
        var Container = dou.define({
            mixins : Containable
        });
        
        var inst = new Container();

        inst.initialize({});
        inst.add('a');
        inst.add(['b', 'c', 'd']);

        inst.select().length.should.equal(4);
        inst.select()[3].should.equal('d');
      });
    });

    describe('remove', function() {

      it('should be able to accept a child or array of children', function () {
        var Container = dou.define({
            mixins : Containable
        });
        
        var inst = new Container();

        inst.initialize({});
        inst.add(['a', 'b', 'c', 'd', 'e']);
        inst.remove(['b', 'c', 'd']);

        inst.select().length.should.equal(2);
        inst.select()[1].should.equal('e');
      });


    });

  });

});

