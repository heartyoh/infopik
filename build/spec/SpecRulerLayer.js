(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var createView;
    createView = function(attributes) {
      var layer, target_comp, target_view;
      layer = new kin.Layer(attributes);
      if (attributes.offset_monitor_target) {
        target_comp = this.findComponent(attributes.offset_monitor_target)[0];
        target_view = this.findViewByComponent(target_comp);
        target_view.on('change-offset', function(e) {
          var children;
          if (!layer.__hori__) {
            children = layer.getChildren().toArray();
            layer.__hori__ = children[0];
            layer.__vert__ = children[1];
          }
          layer.__hori__.setAttr('zeropos', -e.x);
          layer.__vert__.setAttr('zeropos', -e.y);
          return layer.draw();
        });
      }
      return layer;
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
