"use strict";

define(['src/Component'], function (Component) {

  describe('Component', function () {

    describe('core mixins', function() {

      it('should have functions supported by dou core mixins', function () {
        var inst = new Component();

        inst.set.should.be.a('function');

        inst.serialize.should.be.a('function');

      });


    });

  });

});

