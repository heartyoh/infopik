(function() {
  var __hasProp = {}.hasOwnProperty;

  define([], function() {
    "use strict";
    var EventTracker, StandAloneTracker;
    StandAloneTracker = (function() {
      function StandAloneTracker(target, handlers, self) {
        var ev, handler;
        this.started = false;
        if (target) {
          this.target = target;
        }
        this.handlers = handlers;
        self = self || this.target || this;
        this.boundhandler = {};
        for (ev in handlers) {
          if (!__hasProp.call(handlers, ev)) continue;
          handler = handlers[ev];
          if (typeof handler === 'function') {
            this.boundhandler[ev] = handler.bind(self);
          }
        }
      }

      StandAloneTracker.prototype.on = function() {
        var ev, handler, _ref;
        if (this.started) {
          return;
        }
        _ref = this.boundhandler;
        for (ev in _ref) {
          if (!__hasProp.call(_ref, ev)) continue;
          handler = _ref[ev];
          this.target.on(ev, handler);
        }
        return this.started = true;
      };

      StandAloneTracker.prototype.off = function() {
        var ev, handler, _ref;
        _ref = this.boundhandler;
        for (ev in _ref) {
          if (!__hasProp.call(_ref, ev)) continue;
          handler = _ref[ev];
          this.target.off(ev, handler);
        }
        return this.started = false;
      };

      return StandAloneTracker;

    })();
    return EventTracker = (function() {
      function EventTracker() {
        this.trackers = [];
      }

      EventTracker.prototype.on = function(target, handlers, self) {
        var tracker;
        tracker = new StandAloneTracker(target, handlers, self);
        this.trackers.push(tracker);
        return tracker.on();
      };

      EventTracker.prototype.off = function(target, handlers) {
        var i, idx, idxs, tracker, _i, _len, _ref, _results;
        idxs = (function() {
          var _i, _len, _ref, _results;
          _ref = this.trackers;
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            tracker = _ref[i];
            if (target === tracker.target && ((!handlers) || (handlers === tracker.handlers))) {
              _results.push(i);
            }
          }
          return _results;
        }).call(this);
        _ref = idxs.reverse();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          idx = _ref[_i];
          _results.push(this.trackers.splice(idx, 1)[0].off());
        }
        return _results;
      };

      EventTracker.prototype.all = function() {
        var tracker, _i, _len, _ref, _results;
        _ref = this.trackers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tracker = _ref[_i];
          _results.push(tracker);
        }
        return _results;
      };

      EventTracker.prototype.despose = function() {
        var tracker, _i, _len, _ref;
        _ref = this.trackers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tracker = _ref[_i];
          tracker.off();
        }
        return this.trackers = [];
      };

      EventTracker.StandAlone = StandAloneTracker;

      return EventTracker;

    })();
  });

}).call(this);
