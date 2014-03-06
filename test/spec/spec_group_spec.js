"use strict";

define(['dou', 'KineticJS', 'src/ComponentRegistry', 'src/ComponentFactory', 'src/SpecGroup', 'src/SpecRect'], 
  function (dou, kin, ComponentRegistry, ComponentFactory, SpecGroup, SpecRect) {

  describe('SpecGroup', function () {

    var componentFactory;
    var container;
    var stage;
  	var layer;

  	beforeEach(function() {
      var componentRegistry = new ComponentRegistry();

      componentRegistry.register(SpecGroup);
      componentRegistry.register(SpecRect);

      componentFactory = new ComponentFactory();
      componentFactory.setComponentRegistry(componentRegistry);

      if(!container) {
        container = document.createElement('div');
        container.setAttribute('id', 'container_group');
        document.body.appendChild(container);
      }

      stage = new Kinetic.Stage({
        container: 'container_group',
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

      it('should draw a group on the canvas', function () {
        
        var group = componentFactory.createComponent(SpecGroup.type, {
          x: 150,
          y: 30,
          width: 200,
          height: 100
        });

        var rect1 = componentFactory.createComponent(SpecRect.type, {
          x: 10,
          y: 10,
          fill: 'red',
          stroke: 'darkgray',
          width: 100,
          height: 50
        });

        var rect2 = componentFactory.createComponent(SpecRect.type, {
          x: 110,
          y: 110,
          width: 100,
          height: 50
        });

        group.add(rect1);
        group.add(rect2);

        var vgroup = componentFactory.createView(group);
        var vrect1 = componentFactory.createView(rect1);
        var vrect2 = componentFactory.createView(rect2);

        vgroup.add(vrect1);
        vgroup.add(vrect2);

        layer.add(vgroup);

        layer.draw();
      });


    });

  });

});

