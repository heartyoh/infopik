(function() {
  var __hasProp = {}.hasOwnProperty;

  define(['dou', './ComponentSelector'], function(dou, ComponentSelector) {
    "use strict";
    var EventController, control, event_handler_fn;
    control = function(handler_map, event, args) {
      var event_map, event_name, handler, selector, _results;
      _results = [];
      for (selector in handler_map) {
        if (!__hasProp.call(handler_map, selector)) continue;
        event_map = handler_map[selector];
        if (ComponentSelector.select(selector, event.target)) {
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (event_name in event_map) {
              if (!__hasProp.call(event_map, event_name)) continue;
              handler = event_map[event_name];
              if (event_name === event.name) {
                _results1.push(handler.apply(this, args));
              }
            }
            return _results1;
          }).call(this));
        }
      }
      return _results;
    };
    event_handler_fn = function() {
      var args, e;
      args = arguments;
      e = args[args.length - 1];
      return this.controllers.forEach(function(handler_map) {
        return control.call(this, handler_map, e, args);
      }, this.context);
    };
    EventController = (function() {
      function EventController(target) {
        this.setTarget(target);
      }

      EventController.prototype.setTarget = function(target) {
        return this.target = target;
      };

      EventController.prototype.start = function(context) {
        return this.target.on('all', event_handler_fn, {
          context: context || null,
          controllers: this
        });
      };

      EventController.prototype.stop = function() {
        return this.target.off('all', event_handler_fn);
      };

      EventController.prototype.despose = function() {
        this.stop();
        this.clear();
        return this.target = null;
      };

      return EventController;

    })();
    dou.mixin(EventController, dou["with"].collection.withList);
    return EventController;
  });

}).call(this);
