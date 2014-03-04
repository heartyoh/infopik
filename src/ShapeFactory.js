(function() {
  define(['src/ComponentRegistry'], function(Container) {
    "use strict";
    var ShapeFactory;
    ShapeFactory = (function() {
      function ShapeFactory() {}

      ShapeFactory.prototype.setComponentRegistry = function(componentRegistry) {
        return this.componentRegistry = componentRegistry;
      };

      ShapeFactory.prototype.getComponentRegistry = function() {
        return this.componentRegistry;
      };

      ShapeFactory.prototype.createShape = function(type, attributes) {
        var spec;
        spec = this.componentRegistry.get(type);
        if (!spec) {
          throw new Error("Component Spec Not Found for type '" + type + "'");
        }
        return spec.shape_factory.createShape(attributes);
      };

      return ShapeFactory;

    })();
    return ShapeFactory;
  });

}).call(this);
