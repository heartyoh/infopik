(function() {
  var __hasProp = {}.hasOwnProperty;

  define([], function() {
    "use strict";
    var EventTracker;
    return EventTracker = (function() {
      function EventTracker(target, handlers, self) {
        var ev, handler;
        this.started = false;
        if (target) {
          this.target = target;
        }
        this.self = self || this.target || this;
        this.handlers = {};
        for (ev in handlers) {
          if (!__hasProp.call(handlers, ev)) continue;
          handler = handlers[ev];
          if (typeof handler === 'function') {
            this.handlers[ev] = handler.bind(this.self);
          }
        }
      }

      EventTracker.prototype.on = function() {
        var ev, handler, _ref;
        if (this.started) {
          return;
        }
        _ref = this.handlers;
        for (ev in _ref) {
          if (!__hasProp.call(_ref, ev)) continue;
          handler = _ref[ev];
          this.target.on(ev, handler);
        }
        return this.started = true;
      };

      EventTracker.prototype.off = function() {
        var ev, handler, _ref;
        _ref = this.handlers;
        for (ev in _ref) {
          if (!__hasProp.call(_ref, ev)) continue;
          handler = _ref[ev];
          this.target.off(ev, handler);
        }
        return this.started = false;
      };

      return EventTracker;

    })();
  });

}).call(this);
