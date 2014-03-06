"use strict";

define(['src/ComponentFactory', 'src/ComponentRegistry'], function (ComponentFactory, ComponentRegistry) {

  describe('ComponentFactory', function () {
    var factory;

    beforeEach(function() {
      factory = new ComponentFactory();
      var registry = new ComponentRegistry();

      registry.register({
        type: 'rectangle',
        name: 'rectangle',
        containable: false,
        description: 'Rectangle Specification',
        defaults: {
          width: 100,
          height: 50,
          fill: 'green',
          stroke: 'black',
          strokeWidth: 4
        },
        view_factory_fn: function(attrs) {},
        handle_factory_fn: function(attrs) {},
        toolbox_image: 'images/toolbox_rectangle.png'
      });

      factory.setComponentRegistry(registry);
    });

    describe('createComponent', function() {

      it('should generate unique id for the object without id', function () {

        var component = factory.createComponent('rectangle', {
          x : 100,
          y : 100
        });

        component.get('id').should.exist;
        component.get('id').should.match(/^noid-/);
      });

      it('should not generate unique id for the object with id', function () {

        var component = factory.createComponent('rectangle', {
          x : 100,
          y : 100,
          id : 'bigest'
        });

        component.get('id').should.be.ok;
        component.get('id').should.equal('bigest');
      });

    });

  });

});
