"use strict";

define([
  'src/ComponentFactory',
  'src/ComponentRegistry',
  'src/SpecGroup',
  'src/SpecRect',
  'src/SpecRing',
  'src/SpecInfographic',
  'test/spec/infographic/sample_01'
], function (
  ComponentFactory,
  ComponentRegistry,
  SpecGroup,
  SpecRect,
  SpecRing,
  SpecInfographic,
  sample_01
) {

  describe('ComponentFactory', function () {
    var registry;
    var factory;

    beforeEach(function() {
      registry = new ComponentRegistry();
      factory = new ComponentFactory(registry);
    });

    describe('createComponent', function() {

      beforeEach(function() {
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

      });

      it('should generate unique id for the object without id', function () {

        var component = factory.createComponent({
          type: 'rectangle', 
          attrs: {
            x : 100,
            y : 100
          }
        });

        component.get('id').should.exist;
        component.get('id').should.match(/^noid-/);
      });

      it('should not generate unique id for the object with id', function () {

        var component = factory.createComponent({
          type: 'rectangle', 
          attrs: {
            x : 100,
            y : 100,
            id : 'bigest'
          }
        });

        component.get('id').should.be.ok;
        component.get('id').should.equal('bigest');
      });
    });

    describe('createContainer', function() {

      beforeEach(function() {
        registry.register(SpecRect);
        registry.register(SpecRing);
        registry.register(SpecGroup);
        registry.register(SpecInfographic);
      });

      it('should create descendents at once', function () {

        var component = factory.createComponent(sample_01);

        component.type.should.equal('infographic');
        component.size().should.equal(2);
      });

    });

  });

});
