(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var RectHandleFactory, RectViewFactory;
    RectViewFactory = (function() {
      function RectViewFactory() {}

      RectViewFactory.createView = function(attributes) {
        return new kin.Rect(attributes);
      };

      return RectViewFactory;

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
      containable: false,
      description: 'Rectangle Specification',
      defaults: {
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 4
      },
      view_factory: RectViewFactory,
      handle_factory: RectHandleFactory,
      toolbox_image: 'images/toolbox_rectangle.png'
    };
  });

}).call(this);
