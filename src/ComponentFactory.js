(function() {
  define(['dou', './Component', './Container', './EventTracker'], function(dou, Component, Container, EventTracker) {
    "use strict";
    var ComponentFactory;
    ComponentFactory = (function() {
      function ComponentFactory(componentRegistry, eventTracker) {
        this.componentRegistry = componentRegistry;
        this.eventTracker = eventTracker;
        this.seed = 1;
      }

      ComponentFactory.prototype.despose = function() {
        return this.componentRegistry = null;
      };

      ComponentFactory.prototype.uniqueId = function() {
        return "noid-" + (this.seed++);
      };

      ComponentFactory.prototype.createView = function(component, context) {
        var spec, type, view;
        type = component.type;
        spec = this.componentRegistry.get(type);
        if (!spec) {
          throw new Error("Component Spec Not Found for type '" + type + "'");
        }
        view = spec.view_factory_fn(component.getAll());
        if (component instanceof Container) {
          component.forEach(function(child) {
            return view.add(this.createView(child));
          }, this);
        }
        if (spec.view_listener) {
          this.eventTracker.on(view, spec.view_listener, context);
        }
        return view;
      };

      ComponentFactory.prototype.createComponent = function(type, attributes, context) {
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
        component.initialize(dou.util.shallow_merge(spec.defaults || {}, attributes || {}));
        if (!component.get('id')) {
          component.set('id', this.uniqueId());
        }
        if (spec.component_listener) {
          this.eventTracker.on(component, spec.component_listener, context);
        }
        return component;
      };

      return ComponentFactory;

    })();
    return ComponentFactory;
  });

}).call(this);
