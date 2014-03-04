(function() {
  define([], function() {
    "use strict";
    var HandleRenderer;
    HandleRenderer = (function() {
      function HandleRenderer(provider) {
        this.provider = provider({
          draw: function(context) {}
        });
      }

      return HandleRenderer;

    })();
    return HandleRenderer;
  });

}).call(this);
