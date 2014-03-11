(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var createHandle, createView;
    createView = function(attributes) {
      var group;
      group = new kin.Group(attributes);
      group.add(new kin.Rect(dou.util.merge(attributes, {
        draggable: false,
        x: 0,
        y: 0
      })));
      return group;
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
