"use strict";

define([
  'dou',
  'KineticJS',
  'build/MVCMixin',
  'build/ComponentRegistry',
  'build/ComponentFactory',
  'build/spec/SpecGroup',
  'build/spec/SpecRect'
], function (
  dou,
  kin,
  MVCMixin,
  ComponentRegistry,
  ComponentFactory,
  SpecGroup,
  SpecRect
) {

  describe('SpecGroup', function () {

    var controller;
    var componentFactory;
    var componentRegistry;
    var container;
    var stage;
    var layer;

    beforeEach(function() {
      componentRegistry = new ComponentRegistry();

      controller = dou.mixin({}, MVCMixin.controller);

      componentRegistry.register(SpecGroup);
      componentRegistry.register(SpecRect);

      componentFactory = new ComponentFactory(componentRegistry);

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
      stage.destroy();
      componentFactory.dispose();
      componentRegistry.dispose();
    });

    describe('render', function() {

      it('should draw a group on the canvas', function () {
        
        var group = componentFactory.createComponent({
          type: SpecGroup.type, 
          attrs: {
            x: 150,
            y: 30,
            width: 200,
            height: 100
          }
        }, controller);

        var rect1 = componentFactory.createComponent({
          type: SpecRect.type, 
          attrs: {
            x: 10,
            y: 10,
            fill: 'red',
            stroke: 'darkgray',
            width: 100,
            height: 50
          }
        }, controller);

        var rect2 = componentFactory.createComponent({
          type: SpecRect.type, 
          attrs: {
            x: 110,
            y: 110,
            width: 100,
            height: 50
          }
        }, controller);

        group.add(rect1);
        group.add(rect2);

        var vgroup = componentFactory.createView(group, controller);
        var vrect1 = componentFactory.createView(rect1, controller);
        var vrect2 = componentFactory.createView(rect2, controller);

        vgroup.add(vrect1);
        vgroup.add(vrect2);

        layer.add(vgroup);

        layer.draw();
      });


    });

  });

});

