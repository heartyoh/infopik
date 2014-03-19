(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var createHandle, createView;
    createView = function(attributes) {
      return new kin.Star(attributes);
    };
    createHandle = function(attributes) {
      return new Kin.Star(attributes);
    };
    return {
      type: 'star',
      name: 'star',
      description: 'Star Specification',
      defaults: {
        width: 100,
        height: 50,
        numPoints: 5,
        innerRadius: 35,
        outerRadius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_star.png'
    };
  });

}).call(this);
