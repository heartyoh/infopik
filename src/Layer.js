(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var Layer;
    Layer = (function() {
      function Layer() {
        this.layer = new kin.Layer();
      }

      Layer.prototype.setContainer = function(container) {
        return this.container = container;
      };

      Layer.prototype.getContainer = function() {
        return this.container;
      };

      return Layer;

    })();
    return Layer;
  });

}).call(this);
