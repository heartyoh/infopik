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
            return view.add(this.createView(child, context));
          }, this);
        }
        if (spec.view_listener) {
          this.eventTracker.on(view, spec.view_listener, context);
        }
        return view;
      };

      ComponentFactory.prototype.createComponent = function(obj, context) {
        var child, component, spec, _i, _len, _ref;
        spec = this.componentRegistry.get(obj.type);
        if (!spec) {
          throw new Error("Component Spec Not Found for type '" + obj.type + "'");
        }
        if (spec.containable) {
          component = new Container(obj.type);
          if (obj.components) {
            _ref = obj.components;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              component.add(this.createComponent(child, context));
            }
          }
        } else {
          component = new Component(obj.type);
        }
        component.initialize(dou.util.shallow_merge(spec.defaults || {}, obj.attrs || {}));
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
