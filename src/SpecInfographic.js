(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var createHandle, createView;
    createView = function(attributes) {
      var infographic;
      infographic = new kin.Group(attributes);
      infographic.add(new kin.Rect(dou.util.merge(attributes, {
        draggable: false,
        x: 0,
        y: 0
      })));
      return infographic;
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
        width: 100,
        height: 50
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_infographic.png'
    };
  });

}).call(this);
