(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var createHandle, createView;
    createView = function(attributes) {
      return new kin.Group(attributes);
    };
    createHandle = function(attributes) {
      return new Kin.Group(attributes);
    };
    return {
      type: 'infographic',
      name: 'infographic',
      containable: true,
      container_type: 'container',
      description: 'Infographic Specification',
      defaults: {
        draggable: false
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_infographic.png'
    };
  });

}).call(this);
