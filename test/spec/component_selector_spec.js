"use strict";

define(['dou', 'src/Component', 'src/ComponentSelector'], function (dou, Component, ComponentSelector) {

  describe('ComponentSelector', function () {

    describe('select', function() {

      it('should match selector with component type', function () {

        var component = new Component('sample');

        ComponentSelector.select('sample', component).should.be.true;
        ComponentSelector.select('simple', component).should.be.false;
      });

    });

  });

});

