(function() {
  var __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  define(['src/ComponentController'], function(ComponentController) {
    "use strict";
    var ControllerManager, control, event_handler_fn, select;
    select = function(selector, target) {
      return selector === target.type;
    };
    control = function() {
      var controller, ev, event, handler, handler_map, map, others, selector, target, _results;
      controller = arguments[0], event = arguments[1], target = arguments[2], others = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
      handler_map = controller.getHandlerMap();
      _results = [];
      for (selector in handler_map) {
        if (!__hasProp.call(handler_map, selector)) continue;
        map = handler_map[selector];
        if (select(selector, target)) {
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (ev in map) {
              if (!__hasProp.call(map, ev)) continue;
              handler = map[ev];
              if (ev === event) {
                _results1.push(handler.apply(controller, others.unshift(target)));
              }
            }
            return _results1;
          })());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    event_handler_fn = function() {
      var controller, _i, _len, _ref, _results;
      _ref = this.controllers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        controller = _ref[_i];
        _results.push(control(controller, arguments));
      }
      return _results;
    };
    ControllerManager = (function() {
      function ControllerManager() {
        this.controllers = [];
      }

      ControllerManager.prototype.setContainer = function(container) {
        return this.container = container;
      };

      ControllerManager.prototype.add = function(controller) {
        var i, _i, _len;
        if (!(contoller instanceof Array)) {
          return add.call(this, [contoller]);
        }
        if (this.controllers.indexOf(i) === -1) {
          for (_i = 0, _len = contoller.length; _i < _len; _i++) {
            i = contoller[_i];
            this.contollers.push(i);
          }
        }
        return this;
      };

      ControllerManager.prototype.remove = function(controller) {
        var i, idx, _i, _len;
        if (!(controller instanceof Array)) {
          return remove.call(this, [controller]);
        }
        for (_i = 0, _len = controller.length; _i < _len; _i++) {
          i = controller[_i];
          idx = this.controllers.indexOf(i);
          if (idx === -1) {
            return;
          }
          if (idx > -1) {
            this.controllers.splice(idx, 1);
          }
        }
        return this;
      };

      ControllerManager.prototype.removeAll = function() {
        return this.controllers = [];
      };

      ControllerManager.prototype.start = function() {
        return this.container.on('all', event_handler_fn, this);
      };

      ControllerManager.prototype.stop = function() {
        return this.controller.off('all', event_handler_fn);
      };

      ControllerManager.prototype.despose = function() {
        this.stop();
        this.removeAll();
        return this.container = null;
      };

      return ControllerManager;

    })();
    return ControllerManager;
  });

}).call(this);
