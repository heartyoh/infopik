(function() {
  var __hasProp = {}.hasOwnProperty;

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

      ComponentRegistry.prototype.unregister = function(type) {
        return this.componentSpecs;
      };

      ComponentRegistry.prototype.forEach = function(fn, context) {
        var name, spec, _ref, _results;
        _ref = this.componentSpecs;
        _results = [];
        for (name in _ref) {
          if (!__hasProp.call(_ref, name)) continue;
          spec = _ref[name];
          _results.push(fn.call(context, name, spec));
        }
        return _results;
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
