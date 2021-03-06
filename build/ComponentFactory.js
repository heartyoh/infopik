(function() {
  var __hasProp = {}.hasOwnProperty;

  define(['dou', './MVCMixin', './Component', './Container', './EventEngine', './EventTracker'], function(dou, MVCMixin, Component, Container, EventEngine, EventTracker) {
    "use strict";
    var ComponentFactory;
    ComponentFactory = (function() {
      ComponentFactory.prototype.seed = 1;

      function ComponentFactory(componentRegistry, eventEngine, eventTracker) {
        this.componentRegistry = componentRegistry;
        this.eventEngine = eventEngine;
        this.eventTracker = eventTracker;
      }

      ComponentFactory.prototype.dispose = function() {
        this.componentRegistry = null;
        if (this.eventEngine) {
          return this.eventEngine.dispose();
        }
      };

      ComponentFactory.prototype.uniqueId = function() {
        return "noid-" + (this.seed++);
      };

      ComponentFactory.prototype.createView = function(component, controller) {
        var handlers, selector, spec, type, variable, view, _ref;
        type = component.type;
        spec = this.componentRegistry.get(type);
        if (!spec) {
          throw new Error("Component Spec Not Found for type '" + type + "'");
        }
        view = spec.view_factory_fn.call(controller, component.getAll());
        controller.attach(component, view);
        if (component instanceof Container) {
          component.forEach(function(child) {
            return view.add(this.createView(child, controller));
          }, this);
        }
        if (spec.view_event_map) {
          _ref = spec.view_event_map;
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
            this.eventTracker.on(selector, handlers, view, controller);
          }
        }
        return view;
      };

      ComponentFactory.prototype.createComponent = function(obj, controller) {
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
              component.add(this.createComponent(child, controller));
            }
          }
          if (obj.components) {
            _ref1 = obj.components;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              child = _ref1[_j];
              component.add(this.createComponent(child, controller));
            }
          }
        } else {
          component = new Component(obj.type);
        }
        component.initialize(dou.util.shallow_merge(spec.defaults || {}, obj.attrs || {}));
        if (spec.model_initialize_fn) {
          spec.model_initialize_fn.call(component);
        }
        if (!component.get('id')) {
          component.set('id', this.uniqueId());
        }
        if (spec.exportable) {
          spec.exportable(controller, component);
        }
        if (spec.model_event_map) {
          this.eventEngine.add(component, spec.model_event_map, controller);
        }
        component.addDisposer((function(_this) {
          return function() {
            var view, _k, _len2, _ref2;
            _this.eventEngine.remove(component);
            _ref2 = component.getViews();
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              view = _ref2[_k];
              _this.eventTracker.off(view);
              view.destroy();
            }
            return component.detachAll();
          };
        })(this));
        return component;
      };

      return ComponentFactory;

    })();
    return ComponentFactory;
  });

}).call(this);
