(function() {
  var __hasProp = {}.hasOwnProperty;

  define(['dou', './ComponentSelector'], function(dou, ComponentSelector) {
    "use strict";
    var EventPump, control, event_handler_fn;
    control = function(root, listener, handlers, event, args) {
      var event_map, event_name, handler, selector, _results;
      _results = [];
      for (selector in handlers) {
        if (!__hasProp.call(handlers, selector)) continue;
        event_map = handlers[selector];
        if (ComponentSelector.match(selector, event.origin, listener, root)) {
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (event_name in event_map) {
              if (!__hasProp.call(event_map, event_name)) continue;
              handler = event_map[event_name];
              if (!(event_name === event.name)) {
                continue;
              }
              event.listener = listener;
              _results1.push(handler.apply(this, args));
            }
            return _results1;
          }).call(this));
        }
      }
      return _results;
    };
    event_handler_fn = function() {
      var args, e, eventPump, item, _i, _len, _ref, _results;
      args = arguments;
      e = args[args.length - 1];
      eventPump = this.eventPump;
      _ref = eventPump.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(control.call(this.context, eventPump.deliverer, item.listener, item.clonedHandlers, e, args));
      }
      return _results;
    };
    EventPump = (function() {
      function EventPump(deliverer) {
        this.setDeliverer(deliverer);
        this.listeners = [];
      }

      EventPump.prototype.setDeliverer = function(deliverer) {
        return this.deliverer = deliverer;
      };

      EventPump.prototype.start = function(context) {
        return this.deliverer.on('all', event_handler_fn, {
          context: context || null,
          eventPump: this
        });
      };

      EventPump.prototype.stop = function() {
        return this.deliverer.off('all', event_handler_fn);
      };

      EventPump.prototype.on = function(listener, handlers) {
        var clonedHandlers, handler, selector, selectors, value, variable, _i, _len;
        clonedHandlers = dou.util.clone(handlers);
        selectors = Object.keys(clonedHandlers);
        for (_i = 0, _len = selectors.length; _i < _len; _i++) {
          selector = selectors[_i];
          if (!(selector.indexOf('?') === 0)) {
            continue;
          }
          handler = clonedHandlers[selector];
          variable = selector.substr(1);
          value = listener.get(variable);
          delete clonedHandlers[selector];
          if (value) {
            clonedHandlers[value] = handler;
          } else {
            console.log("EventPump#on", "variable " + selector + " is not evaluated on listener");
          }
        }
        return this.listeners.push({
          listener: listener,
          handlers: handlers,
          clonedHandlers: clonedHandlers
        });
      };

      EventPump.prototype.off = function(listener, handlers) {
        var index, item, _i, _len, _ref, _results;
        _ref = this.listeners;
        _results = [];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          item = _ref[index];
          if (item.listener === listener && (!handlers || item.handlers === handlers)) {
            _results.push(this.listeners.splice(index, 1));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      EventPump.prototype.clear = EventPump.listeners = [];

      EventPump.prototype.despose = function() {
        this.stop();
        this.clear();
        return this.deliverer = null;
      };

      return EventPump;

    })();
    return EventPump;
  });

}).call(this);
