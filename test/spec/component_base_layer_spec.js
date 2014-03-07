"use strict";

define([
  'dou',
  'KineticJS',
  'src/ComponentBaseLayer',
  'src/ComponentRegistry',
  'src/ComponentFactory',
  'src/CommandManager',
  'src/SpecGroup',
  'src/SpecRect'
], function (
  dou,
  kin,
  ComponentBaseLayer,
  ComponentRegistry,
  ComponentFactory,
  CommandManager,
  SpecGroup,
  SpecRect
) {

  describe('ComponentBaseLayer', function () {

    var stage;
    var layer;
    var div;
    var componentFactory;

  	beforeEach(function() {
      var componentRegistry = new ComponentRegistry();

      componentRegistry.register(SpecGroup);
      componentRegistry.register(SpecRect);

      componentFactory = new ComponentFactory();
      componentFactory.setComponentRegistry(componentRegistry);

      var commandManager = new CommandManager();

      layer = new ComponentBaseLayer({
        commandManager: commandManager,
        componentFactory: componentFactory
      });

      if(!div) {
        div = document.createElement('div');
        div.setAttribute('id', 'component_base_layer');
        document.body.appendChild(div);
      }

      var stage = new Kinetic.Stage({
        container: 'component_base_layer',
        width: 600,
        height: 400
      });

      stage.add(layer.getView());
  	});

    afterEach(function() {
      // stage.destroy();
    });

    describe('render', function() {

      it('should ...', function () {
        
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

        layer.getModel().add(group);

        layer.getModel().remove(group);
      });


    });

  });

});

