(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var createHandle, createView;
    createView = function(attributes) {
      return new kin.Group(attributes);
    };
    createHandle = function(attributes) {
      return new Kin.Group(attributes);
    };
    return {
      type: 'group',
      name: 'group',
      containable: true,
      container_type: 'container',
      description: 'Group Specification',
      defaults: {
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_group.png'
    };
  });

}).call(this);
