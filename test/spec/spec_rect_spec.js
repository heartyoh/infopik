"use strict";

define(['dou', 'KineticJS', 'src/ComponentRegistry', 'src/ComponentFactory', 'src/Component', 'src/SpecRect'], 
  function (dou, kin, ComponentRegistry, ComponentFactory, Component, SpecRect) {

  describe('SpecRect', function () {

    var componentFactory;
    var container;
    var stage;
  	var layer;

  	beforeEach(function() {
      var componentRegistry = new ComponentRegistry();

      componentRegistry.register(SpecRect);

      componentFactory = new ComponentFactory(componentRegistry);

      if(!container) {
        container = document.createElement('div');
        container.setAttribute('id', 'container_rect');
        document.body.appendChild(container);
      }

      stage = new Kinetic.Stage({
        container: 'container_rect',
        width: 578,
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
        
        var component = componentFactory.createComponent(SpecRect.type, {
          x: 239,
          y: 75,
          width: 100,
          height: 50
        });

        var rect = componentFactory.createView(component);

        layer.add(rect);

        layer.draw();
      });


    });

  });

});

