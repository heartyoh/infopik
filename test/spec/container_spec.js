"use strict";

define(['src/Component', 'src/Container'], function (Component, Container) {

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

        inst.add(new Component());

        inst.select().length.should.equal(1);

      });

    });

  });

});

