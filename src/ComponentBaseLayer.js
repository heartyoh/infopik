(function() {
  define(['dou', 'KineticJS', './Component', './Container', './EventController'], function(dou, kin, Component, Container, EventController) {
    "use strict";
    var ComponentBaseLayer, container_controller, onadd, onremove;
    onadd = function(i, e) {
      var component, container, vcomponent, vcontainer;
      container = i.container;
      component = i.component;
      vcontainer = container === this.model ? this.view : this.view.find("\#" + (container.get('id')));
      vcomponent = this.componentFactory.createView(component);
      vcontainer.add(vcomponent);
      return this.view.draw();
    };
    onremove = function(i, e) {
      i.container;
      i.component;
      return e.target;
    };
    container_controller = {
      'all': {
        'add': onadd,
        'remove': onremove
      }
    };
    ComponentBaseLayer = (function() {
      function ComponentBaseLayer(options) {
        var attributes;
        this.commandManager = options.commandManager, this.componentFactory = options.componentFactory;
        attributes = {
          id: 'root'
        };
        this.model = new Container('root');
        this.model.initialize(attributes);
        this.view = new kin.Layer(attributes);
        this.controller = new EventController();
        this.controller.append(container_controller);
        this.controller.setTarget(this.model);
        this.controller.start(this);
      }

      ComponentBaseLayer.prototype.getView = function() {
        return this.view;
      };

      ComponentBaseLayer.prototype.getModel = function() {
        return this.model;
      };

      ComponentBaseLayer.prototype.getController = function() {
        return this.controller;
      };

      return ComponentBaseLayer;

    })();
    return ComponentBaseLayer;
  });

}).call(this);
