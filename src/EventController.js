(function() {
  var __hasProp = {}.hasOwnProperty;

  define(['dou'], function(dou) {
    "use strict";
    var EventController, control, event_handler_fn, select;
    select = function(selector, target) {
      return selector === target.type;
    };
    control = function(handler_map, event, args) {
      var event_map, event_name, handler, selector, _results;
      _results = [];
      for (selector in handler_map) {
        if (!__hasProp.call(handler_map, selector)) continue;
        event_map = handler_map[selector];
        if (select(selector, event.target)) {
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (event_name in event_map) {
              if (!__hasProp.call(event_map, event_name)) continue;
              handler = event_map[event_name];
              if (event_name === event.name) {
                _results1.push(handler.apply(null, args));
              }
            }
            return _results1;
          })());
        }
      }
      return _results;
    };
    event_handler_fn = function() {
      var args, e;
      args = arguments;
      e = args[args.length - 1];
      return this.forEach(function(handler_map) {
        return control(handler_map, e, args);
      });
    };
    EventController = (function() {
      function EventController(target) {
        this.setTarget(target);
      }

      EventController.prototype.setTarget = function(target) {
        return this.target = target;
      };

      EventController.prototype.start = function() {
        return this.target.on('all', event_handler_fn, this);
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