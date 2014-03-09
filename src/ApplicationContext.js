(function() {
  define(['dou', 'KineticJS', './Component', './Container', './EventController', './EventTracker', './ComponentFactory', './CommandManager', './ComponentRegistry', './ComponentSelector'], function(dou, kin, Component, Container, EventController, EventTracker, ComponentFactory, CommandManager, ComponentRegistry, ComponentSelector) {
    "use strict";
    var ApplicationContext;
    ApplicationContext = (function() {
      function ApplicationContext(options) {
        var attributes, attrs, container, layer, _ref;
        this.application_spec = options.application_spec, container = options.container;
        if (typeof container !== 'string') {
          throw new Error('container is a mandatory string type option.');
        }
        if (!this.application_spec) {
          throw new Error('application_spec is a mandatory option');
        }
        this.commandManager = new CommandManager();
        this.eventTracker = new EventTracker();
        this.eventController = new EventController();
        this.componentRegistry = new ComponentRegistry();
        this.componentRegistry.setRegisterCallback(function(spec) {
          if (spec.controller) {
            return this.eventController.append(spec.controller);
          }
        }, this);
        this.componentRegistry.setUnregisterCallback(function(spec) {
          if (spec.controller) {
            return this.eventController.remove(spec.controller);
          }
        }, this);
        this.componentFactory = new ComponentFactory(this.componentRegistry, this.eventTracker);
        this.componentRegistry.register(this.application_spec);
        attributes = {
          id: 'application',
          container: options.container,
          width: options.width,
          height: options.height
        };
        this.application = this.componentFactory.createComponent(this.application_spec.type, attributes, this);
        this.view = this.componentFactory.createView(this.application, this);
        this.eventController.setTarget(this.application);
        this.eventController.start(this);
        this.application.on('add', this.onadd, this);
        this.application.on('remove', this.onremove, this);
        if (this.application_spec.layers) {
          _ref = this.application_spec.layers;
          for (layer in _ref) {
            attrs = _ref[layer];
            this.application.add(this.componentFactory.createComponent(layer, attrs, this));
          }
        }
      }

      ApplicationContext.prototype.despose = function() {
        this.eventTracker.despose();
        this.eventController.despose();
        this.eventRegistry.despose();
        return this.componentFactory.despose();
      };

      ApplicationContext.prototype.getEventTracker = function() {
        return this.eventTracker;
      };

      ApplicationContext.prototype.getView = function() {
        return this.view;
      };

      ApplicationContext.prototype.getModel = function() {
        return this.model;
      };

      ApplicationContext.prototype.setModel = function(model) {
        var before;
        before = this.model;
        this.model = model;
        return this.application.trigger('change-model', this.model, before);
      };

      ApplicationContext.prototype.getController = function() {
        return this.eventController;
      };

      ApplicationContext.prototype.getApplication = function() {
        return this.application;
      };

      ApplicationContext.prototype.findComponent = function(selector) {
        return ComponentSelector.select(selector, this.application);
      };

      ApplicationContext.prototype.findView = function(selector) {
        return this.view.find(selector);
      };

      ApplicationContext.prototype.findViewByComponent = function(component) {
        return this.view.find("\#" + (component.get('id')));
      };

      ApplicationContext.prototype.createView = function(component) {
        return this.componentFactory.createView(component, this);
      };

      ApplicationContext.prototype.createComponent = function(type, attrs) {
        return this.componentFactory.createComponent(type, attrs, this);
      };

      ApplicationContext.prototype.drawView = function() {
        return this.view.draw();
      };

      ApplicationContext.prototype.execute = function(command) {
        return this.commandManager.execute(command);
      };

      ApplicationContext.prototype.onadd = function(container, component, index, e) {
        var vcomponent, vcontainer;
        vcontainer = container === this.application ? this.view : this.findViewByComponent(container);
        vcomponent = this.createView(component);
        vcontainer.add(vcomponent);
        return this.drawView();
      };

      ApplicationContext.prototype.onremove = function(container, component, e) {
        var vcomponent, vcontainer;
        vcontainer = container === this.application ? this.view : this.findViewByComponent(container);
        vcomponent = this.findViewByComponent(component);
        vcontainer.remove(vcomponent);
        return this.drawView();
      };

      return ApplicationContext;

    })();
    return ApplicationContext;
  });

}).call(this);
