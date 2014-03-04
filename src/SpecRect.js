(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var RectHandleFactory, RectShapeFactory;
    RectShapeFactory = (function() {
      function RectShapeFactory() {}

      RectShapeFactory.createShape = function(attributes) {
        return new kin.Rect(attributes);
      };

      return RectShapeFactory;

    })();
    RectHandleFactory = (function() {
      function RectHandleFactory() {}

      RectHandleFactory.createHandle = function(attributes) {
        return new Kin.Rect(attributes);
      };

      return RectHandleFactory;

    })();
    return {
      type: 'rectangle',
      name: 'rectangle',
      description: 'Rectangle Specification',
      defaults: {
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4
      },
      shape_factory: RectShapeFactory,
      handle_factory: RectHandleFactory,
      toolbox_image: 'images/toolbox_rectangle.png'
    };
  });

}).call(this);
