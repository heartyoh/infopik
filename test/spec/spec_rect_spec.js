"use strict";

define(['dou',
  'KineticJS',
  'build/MVCMixin',
  'build/ComponentRegistry',
  'build/ComponentFactory',
  'build/Component',
  'build/spec/SpecRect'
], function (
  dou,
  kin,
  MVCMixin,
  ComponentRegistry,
  ComponentFactory,
  Component,
  SpecRect
) {

  describe('SpecRect', function () {

    var controller;
    var componentFactory;
    var container;
    var stage;
    var layer;

    beforeEach(function() {
      var componentRegistry = new ComponentRegistry();

      controller = dou.mixin({}, MVCMixin.controller);

      componentRegistry.register(SpecRect);
      componentFactory = new ComponentFactory(componentRegistry);

      if(!container) {
        container = document.createElement('div');
        container.setAttribute('id', 'container_rect');
        document.body.appendChild(container);
      }

      stage = new Kinetic.Stage({
        container: 'container_rect',
        width: 600,
        height: 200
      });

      layer = new Kinetic.Layer();

      stage.add(layer);
    });

    afterEach(function() {
      // stage.destroy();
    });

    describe('render', function() {

      it('should draw a rectangle on the canvas', function () {
        
        var component = componentFactory.createComponent({
          type: SpecRect.type, 
          attrs: {
            x: 239,
            y: 75,
            width: 100,
            height: 50
          }
        }, controller);

        var rect = componentFactory.createView(component, controller);

        layer.add(rect);

        layer.draw();
      });


    });

  });

});

