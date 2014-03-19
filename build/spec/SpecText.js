(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var createHandle, createView;
    createView = function(attributes) {
      return new kin.Text(attributes);
    };
    createHandle = function(attributes) {
      return new Kin.Text(attributes);
    };
    return {
      type: 'text',
      name: 'text',
      description: 'Text Specification',
      defaults: {
        width: "auto",
        height: "auto",
        draggable: true,
        strokeWidth: 1,
        fontSize: 40,
        fontFamily: "Arial",
        fontStyle: "normal",
        fill: "black",
        stroke: "black",
        text: "TEXT",
        rotationDeg: 0
      },
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_text.png'
    };
  });

}).call(this);
