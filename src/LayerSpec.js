(function() {
  define(['dou'], function(dou) {
    "use strict";
    var LayerSpec;
    return LayerSpec = (function() {
      function LayerSpec(config) {
        this.urn = config.urn;
        this.name = config.name;
        this.description = config.description;
        this.defaults = config.defaults;
        this.layer_factory = config.layer_factory;
      }

      return LayerSpec;

    })();
  });

}).call(this);
