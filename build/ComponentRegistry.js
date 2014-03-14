(function() {
  var __hasProp = {}.hasOwnProperty;

  define(['dou', './EventController'], function(dou, EventController) {
    "use strict";
    var ComponentRegistry;
    return ComponentRegistry = (function() {
      function ComponentRegistry() {
        this.componentSpecs = {};
      }

      ComponentRegistry.prototype.despose = function() {
        var keys, type, _i, _len, _results;
        keys = Object.keys(this.componentSpecs);
        _results = [];
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          type = keys[_i];
          _results.push(this.unregister(type));
        }
        return _results;
      };

      ComponentRegistry.prototype.setRegisterCallback = function(callback, context) {
        return this.callback_register = typeof callback === 'function' ? callback.bind(context) : void 0;
      };

      ComponentRegistry.prototype.setUnregisterCallback = function(callback, context) {
        return this.callback_unregister = typeof callback === 'function' ? callback.bind(context) : void 0;
      };

      ComponentRegistry.prototype.register = function(componentSpec) {
        var depspec, name, _ref;
        if (this.componentSpecs[componentSpec.type]) {
          return;
        }
        if (componentSpec.dependencies) {
          _ref = componentSpec.dependencies;
          for (name in _ref) {
            depspec = _ref[name];
            this.register(depspec);
          }
        }
        this.componentSpecs[componentSpec.type] = componentSpec;
        if (this.callback_register) {
          return this.callback_register(componentSpec);
        }
      };

      ComponentRegistry.prototype.unregister = function(type) {
        var spec;
        spec = this.componentSpecs[type];
        if (!spec) {
          return;
        }
        delete this.componentSpecs[type];
        if (this.callback_unregister) {
          this.callback_unregister(spec);
        }
        return spec;
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
