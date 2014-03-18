(function() {
  var __hasProp = {}.hasOwnProperty;

  define(['dou', './Component', './Container', './EventEngine', './EventTracker'], function(dou, Component, Container, EventEngine, EventTracker) {
    "use strict";
    var ComponentFactory;
    ComponentFactory = (function() {
      function ComponentFactory(componentRegistry, eventEngine, eventTracker) {
        this.componentRegistry = componentRegistry;
        this.eventEngine = eventEngine;
        this.eventTracker = eventTracker;
        this.seed = 1;
      }

      ComponentFactory.prototype.despose = function() {
        this.componentRegistry = null;
        if (this.eventEngine) {
          return this.eventEngine.despose();
        }
      };

      ComponentFactory.prototype.uniqueId = function() {
        return "noid-" + (this.seed++);
      };

      ComponentFactory.prototype.createView = function(component, context) {
        var handlers, selector, spec, type, variable, view, _ref;
        type = component.type;
        spec = this.componentRegistry.get(type);
        if (!spec) {
          throw new Error("Component Spec Not Found for type '" + type + "'");
        }
        view = spec.view_factory_fn.call(context, component.getAll());
        view.__component__ = component;
        component.attach(view);
        if (component instanceof Container) {
          component.forEach(function(child) {
            return view.add(this.createView(child, context));
          }, this);
        }
        if (spec.view_listener) {
          _ref = spec.view_listener;
          for (selector in _ref) {
            if (!__hasProp.call(_ref, selector)) continue;
            handlers = _ref[selector];
            if (selector.indexOf('?') === 0) {
              variable = selector.substr(1);
              selector = component.get(variable);
              if (selector === void 0) {
                console.log("ComponentFactory#crateView", "variable " + selector + " is not evaluated on listener");
                continue;
              }
            }
            this.eventTracker.on(selector, handlers, view, {
              component: component,
              application: context
            });
          }
        }
        return view;
      };

      ComponentFactory.prototype.createComponent = function(obj, context) {
        var child, component, spec, _i, _j, _len, _len1, _ref, _ref1;
        spec = this.componentRegistry.get(obj.type);
        if (!spec) {
          throw new Error("Component Spec Not Found for type '" + obj.type + "'");
        }
        if (spec.containable) {
          component = new Container(obj.type);
          if (spec.components) {
            _ref = spec.components;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              component.add(this.createComponent(child, context));
            }
          }
          if (obj.components) {
            _ref1 = obj.components;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              child = _ref1[_j];
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
        if (spec.controller) {
          this.eventEngine.add(component, spec.controller, context);
        }
        return component;
      };

      return ComponentFactory;

    })();
    return ComponentFactory;
  });

}).call(this);
