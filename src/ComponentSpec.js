(function() {
  define(['dou'], function(dou) {
    "use strict";
    var ComponentSpec;
    return ComponentSpec = (function() {
      function ComponentSpec(config) {
        this.urn = config.urn;
        this.name = config.name;
        this.description = config.description;
        this.defaults = config.defaults;
        this.shape_factory = config.shape_factory;
        this.handle_factory = config.handle_factory;
        this.toolbox_image = config.toolbox_image;
      }

      return ComponentSpec;

    })();
  });

}).call(this);
