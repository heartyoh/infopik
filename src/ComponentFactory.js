(function() {
  define(['dou', './Component'], function(dou, Component) {
    "use strict";
    var ComponentFactory;
    ComponentFactory = (function() {
      function ComponentFactory() {}

      ComponentFactory.prototype.setComponentRegistry = function(componentRegistry) {
        return this.componentRegistry = componentRegistry;
      };

      ComponentFactory.prototype.getComponentRegistry = function() {
        return this.componentRegistry;
      };

      ComponentFactory.prototype.createShape = function(component) {
        var spec, type;
        type = component.type;
        spec = this.componentRegistry.get(type);
        if (!spec) {
          throw new Error("Component Spec Not Found for type '" + type + "'");
        }
        return spec.shape_factory.createShape(component.attrs);
      };

      ComponentFactory.prototype.createComponent = function(type, attributes) {
        var component, spec;
        spec = this.componentRegistry.get(type);
        if (!spec) {
          throw new Error("Component Spec Not Found for type '" + type + "'");
        }
        component = new Component(type);
        return component.initialize(dou.util.merge(attributes, spec.defaults));
      };

      return ComponentFactory;

    })();
    return ComponentFactory;
  });

}).call(this);
