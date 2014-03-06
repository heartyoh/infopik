(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var createHandle, createView;
    createView = function(attributes) {
      return new kin.Rect(attributes);
    };
    createHandle = function(attributes) {
      return new Kin.Rect(attributes);
    };
    return {
      type: 'rectangle',
      name: 'rectangle',
      containable: false,
      description: 'Rectangle Specification',
      defaults: {
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_rectangle.png'
    };
  });

}).call(this);
