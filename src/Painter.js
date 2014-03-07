(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['./Container'], function(Container) {
    "use strict";
    var EDIT_MODE, Painter;
    EDIT_MODE = {
      SELECT: 1,
      CREATE: 2
    };
    Painter = (function(_super) {
      __extends(Painter, _super);

      function Painter(options) {
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

      Painter.prototype.getView = function() {
        return this.view;
      };

      Painter.prototype.getModel = function() {
        return this.model;
      };

      Painter.prototype.getController = function() {
        return this.controller;
      };

      Painter.prototype.defaults = {
        edit_mode: EDIT_MODE.SELECT,
        width: 600,
        height: 800
      };

      return Painter;

    })(Container);
    Painter.EDIT_MODE = EDIT_MODE;
    return Painter;
  });

}).call(this);
