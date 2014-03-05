(function() {
  define([], function() {
    "use strict";
    var ComponentController;
    ComponentController = (function() {
      function ComponentController(handler_map) {
        this.handler_map = handler_map;
      }

      ComponentController.prototype.getHandlerMap = function() {
        return this.handler_map;
      };

      return ComponentController;

    })();
    return ComponentController;
  });

}).call(this);
