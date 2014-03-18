(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var createView, onchangeoffset, view_listener;
    createView = function(attributes) {
      return new kin.Layer(attributes);
    };
    onchangeoffset = function(e) {
      var children, layer;
      layer = this.listener;
      if (!layer.__hori__) {
        children = layer.getChildren().toArray();
        layer.__hori__ = children[0];
        layer.__vert__ = children[1];
      }
      layer.__hori__.setAttr('zeropos', -e.x);
      layer.__vert__.setAttr('zeropos', -e.y);
      return layer.draw();
    };
    view_listener = {
      '?offset_monitor_target': {
        'change-offset': onchangeoffset
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
      view_listener: view_listener,
      view_factory_fn: createView,
      components: [
        {
          type: 'ruler',
          attrs: {
            direction: 'horizontal',
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
