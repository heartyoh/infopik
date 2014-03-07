(function() {
  define(['dou', 'KineticJS', './Component', './Container', './EventController', './ComponentFactory', './CommandManager', './ComponentRegistry', './ComponentSelector'], function(dou, kin, Component, Container, EventController, ComponentFactory, CommandManager, ComponentRegistry, ComponentSelector) {
    "use strict";
    var Application;
    Application = (function() {
      function Application(options) {
        var attributes, attrs, componentRegistry, layer, registerSpec, _ref;
        this.application_spec = options.application_spec, this.html_container = options.html_container;
        if (typeof this.html_container !== 'string') {
          throw new Error('html_container should be a string.');
        }
        this.componentFactory = new ComponentFactory();
        this.commandManager = new CommandManager();
        componentRegistry = new ComponentRegistry();
        this.componentFactory.setComponentRegistry(componentRegistry);
        registerSpec = function(spec) {
          var depspec, name, _ref, _results;
          componentRegistry.register(spec);
          if (spec.dependencies) {
            _ref = spec.dependencies;
            _results = [];
            for (name in _ref) {
              depspec = _ref[name];
              _results.push(registerSpec(depspec));
            }
            return _results;
          }
        };
        registerSpec(this.application_spec);
        this.controller = new EventController();
        componentRegistry.forEach(function(name, spec) {
          if (spec.controller) {
            return this.controller.append(spec.controller);
          }
        }, this);
        attributes = {
          id: 'application',
          container: this.html_container,
          width: 578,
          height: 200
        };
        this.container = this.componentFactory.createComponent(this.application_spec.type, attributes);
        this.view = this.componentFactory.createView(this.container);
        this.container.on('add', this.onadd, this);
        this.container.on('remove', this.onremove, this);
        this.controller.setTarget(this.container);
        this.controller.start(this);
        if (this.application_spec.layers) {
          _ref = this.application_spec.layers;
          for (layer in _ref) {
            attrs = _ref[layer];
            this.container.add(this.componentFactory.createComponent(layer, attrs));
          }
        }
      }

      Application.prototype.getView = function() {
        return this.view;
      };

      Application.prototype.getModel = function() {
        return this.model;
      };

      Application.prototype.setModel = function(model) {
        var before;
        before = this.model;
        this.model = model;
        return this.container.trigger('change-model', this.model, before);
      };

      Application.prototype.getController = function() {
        return this.controller;
      };

      Application.prototype.getContainer = function() {
        return this.container;
      };

      Application.prototype.findComponent = function(selector) {
        return ComponentSelector.select(selector, this.container);
      };

      Application.prototype.findView = function(selector) {
        return this.view.find(selector);
      };

      Application.prototype.createView = function(component) {
        return this.componentFactory.createView();
      };

      Application.prototype.createComponent = function(type, attrs) {
        return this.componentFactory.createComponent(type, attrs);
      };

      Application.prototype.onadd = function(container, component, index, e) {
        var vcomponent, vcontainer;
        vcontainer = container === this.container ? this.view : this.view.find("\#" + (container.get('id')));
        vcomponent = this.componentFactory.createView(component);
        vcontainer.add(vcomponent);
        return this.view.draw();
      };

      Application.prototype.onremove = function(container, component, e) {};

      return Application;

    })();
    return Application;
  });

}).call(this);
