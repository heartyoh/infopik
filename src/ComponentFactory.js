(function() {
  define(['dou', './Component', './Container'], function(dou, Component, Container) {
    "use strict";
    var ComponentFactory;
    ComponentFactory = (function() {
      function ComponentFactory() {
        this.seed = 1;
      }

      ComponentFactory.prototype.uniqueId = function() {
        return "noid-" + (this.seed++);
      };

      ComponentFactory.prototype.setComponentRegistry = function(componentRegistry) {
        return this.componentRegistry = componentRegistry;
      };

      ComponentFactory.prototype.getComponentRegistry = function() {
        return this.componentRegistry;
      };

      ComponentFactory.prototype.createView = function(component) {
        var spec, type;
        type = component.type;
        spec = this.componentRegistry.get(type);
        if (!spec) {
          throw new Error("Component Spec Not Found for type '" + type + "'");
        }
        return spec.view_factory_fn(component.attrs);
      };

      ComponentFactory.prototype.createComponent = function(type, attributes) {
        var component, spec;
        spec = this.componentRegistry.get(type);
        if (!spec) {
          throw new Error("Component Spec Not Found for type '" + type + "'");
        }
        if (spec.containable) {
          component = new Container(type);
        } else {
          component = new Component(type);
        }
        component.initialize(dou.util.merge(spec.defaults, attributes));
        if (!component.get('id')) {
          component.set('id', this.uniqueId());
        }
        return component;
      };

      return ComponentFactory;

    })();
    return ComponentFactory;
  });

}).call(this);
