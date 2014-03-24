(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var controller, createView, onadded, onchangeoffset, onresize, view_listener;
    createView = function(attributes) {
      return new kin.Layer(attributes);
    };
    onchangeoffset = function(e) {
      var children, view;
      view = this.listener;
      if (!view.__hori__) {
        children = view.getChildren().toArray();
        view.__hori__ = children[0];
        view.__vert__ = children[1];
      }
      view.__hori__.setAttr('zeropos', -e.x);
      view.__vert__.setAttr('zeropos', -e.y);
      return view.batchDraw();
    };
    onresize = function(e) {
      var children, view;
      view = this.listener;
      if (!view.__hori__) {
        children = view.getChildren().toArray();
        view.__hori__ = children[0];
        view.__vert__ = children[1];
      }
      view.__hori__.setSize({
        width: e.after.width,
        height: 20
      });
      view.__vert__.setSize({
        width: 20,
        height: e.after.height
      });
      return view.batchDraw();
    };
    onadded = function(container, component, index, e) {
      var children, controller, model, stage, view;
      controller = this;
      model = e.listener;
      view = controller.getAttachedViews(model)[0];
      stage = view.getStage();
      if (!view.__hori__) {
        children = view.getChildren().toArray();
        view.__hori__ = children[0];
        view.__vert__ = children[1];
      }
      view.__hori__.setSize({
        width: stage.width(),
        height: 20
      });
      view.__vert__.setSize({
        width: 20,
        height: stage.height()
      });
      return view.batchDraw();
    };
    controller = {
      '(root)': {
        '(self)': {
          added: onadded
        }
      }
    };
    view_listener = {
      '?offset_monitor_target': {
        'change-offset': onchangeoffset
      },
      '(root)': {
        'resize': onresize
      }
    };
    return {
      type: 'ruler-layer',
      name: 'ruler-layer',
      containable: true,
      container_type: 'layer',
      description: 'Ruler Layer Specification',
      defaults: {
        draggable: false
      },
      controller: controller,
      view_listener: view_listener,
      view_factory_fn: createView,
      components: [
        {
          type: 'ruler',
          attrs: {
            direction: 'horizontal',
            name: 'horizontal ruler for ruler-layer',
            margin: [20, 0],
            opacity: 0.8,
            x: 0,
            y: 0,
            width: 1000,
            height: 20,
            zeropos: 20
          }
        }, {
          type: 'ruler',
          attrs: {
            direction: 'vertical',
            name: 'vertical ruler for ruler-layer',
            margin: [20, 0],
            opacity: 0.8,
            x: 0,
            y: 0,
            width: 20,
            height: 1000,
            zeropos: 20
          }
        }
      ],
      toolbox_image: 'images/toolbox_ruler_layer.png'
    };
  });

}).call(this);
