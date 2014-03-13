(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var createView;
    createView = function(attributes) {
      return new kin.Layer(attributes);
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
            opacity: 1,
            x: 0,
            y: 0,
            width: 1000,
            height: 20,
            zeropos: 0
          }
        }, {
          type: 'ruler',
          attrs: {
            direction: 'vertical',
            margin: [20, 0],
            opacity: 1,
            x: 0,
            y: 0,
            width: 20,
            height: 1000,
            zeropos: 0
          }
        }
      ],
      toolbox_image: 'images/toolbox_ruler_layer.png'
    };
  });

}).call(this);
