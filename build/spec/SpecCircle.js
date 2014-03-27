(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var createHandle, createView;
    createView = function(attributes) {
      return new kin.Circle(attributes);
    };
    createHandle = function(attributes) {
      return new Kin.Circle(attributes);
    };
    return {
      type: 'circle',
      name: 'circle',
      description: 'Circle Specification',
      defaults: {
        width: 100,
        height: 100,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_circle.png'
    };
  });

}).call(this);
