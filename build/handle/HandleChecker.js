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
      type: 'handle-checker',
      name: 'handle-checker',
      description: 'Checker Handle Specification',
      defaults: {
        width: 10,
        height: 10,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_handle_checker.png'
    };
  });

}).call(this);
