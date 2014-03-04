(function() {
  define(['dou'], function(dou) {
    "use strict";
    var ComponentRegistry;
    return ComponentRegistry = (function() {
      function ComponentRegistry() {
        this.componentSpecs = {};
      }

      ComponentRegistry.prototype.register = function(componentSpec) {
        return this.componentSpecs[componentSpec.type] = componentSpec;
      };

      ComponentRegistry.prototype.list = function(filter) {
        return Object.keys(this.componentSpecs).map(function(key) {
          return this.componentSpecs[key];
        }, this);
      };

      ComponentRegistry.prototype.get = function(type) {
        var spec;
        spec = this.componentSpecs[type];
        if (spec) {
          return dou.util.clone(this.componentSpecs[type]);
        } else {
          return null;
        }
      };

      return ComponentRegistry;

    })();
  });

}).call(this);
