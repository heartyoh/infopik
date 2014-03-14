(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var createHandle, createView;
    createView = function(attributes) {
      return new kin.Ring(attributes);
    };
    createHandle = function(attributes) {
      return new Kin.Ring(attributes);
    };
    return {
      type: 'ring',
      name: 'ring',
      description: 'Ring Specification',
      defaults: {
        innerRadius: 40,
        outerRadius: 80,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 5
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_ring.png'
    };
  });

}).call(this);
