"use strict";

define(['src/Container'], function (Container) {

  describe('Container', function () {

    describe('core mixins', function() {

      it('should have functions supported by dou core mixins', function () {
        var inst = new Container();

        inst.set.should.be.a('function');

        inst.serialize.should.be.a('function');

      });

      it('should contain components as a children', function () {
        var inst = new Container();

        inst.initialize();

        inst.add('A');

        inst.select().length.should.equal(1);

      });

    });

  });

});

