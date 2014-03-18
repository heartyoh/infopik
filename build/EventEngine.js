(function() {
  var __hasProp = {}.hasOwnProperty;

  define(['dou', './EventPump', './ComponentSelector'], function(dou, EventPump, ComponentSelector) {
    "use strict";
    var EventEngine;
    EventEngine = (function() {
      function EventEngine(root) {
        this.eventPumps = [];
        this.setRoot(root);
      }

      EventEngine.prototype.setRoot = function(root) {
        return this.root = root;
      };

      EventEngine.prototype.stop = function() {
        var item, _i, _len, _ref, _results;
        _ref = this.eventPumps;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _results.push(item.eventPump.stop());
        }
        return _results;
      };

      EventEngine.prototype.add = function(listener, handlerMap, context) {
        var eventPump, handlers, selector, target, targets, _results;
        if (!this.root) {
          return;
        }
        _results = [];
        for (selector in handlerMap) {
          if (!__hasProp.call(handlerMap, selector)) continue;
          handlers = handlerMap[selector];
          targets = ComponentSelector.select(selector, this.root, listener);
          _results.push((function() {
            var _i, _len, _results1;
            _results1 = [];
            for (_i = 0, _len = targets.length; _i < _len; _i++) {
              target = targets[_i];
              eventPump = new EventPump(target);
              eventPump.on(listener, handlers);
              eventPump.start(context);
              _results1.push(this.eventPumps.push({
                eventPump: eventPump,
                listener: listener,
                handlerMap: handlerMap,
                target: target
              }));
            }
            return _results1;
          }).call(this));
        }
        return _results;
      };

      EventEngine.prototype.remove = function(listener, handlerMap) {
        var index, item, _i, _len, _ref, _results;
        _ref = this.eventPumps;
        _results = [];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          item = _ref[index];
          if (item.listener === listener && (!handlerMap || item.handlerMap === handlerMap)) {
            this.eventPumps.splice(index, 1);
            _results.push(item.eventPump.despose());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      EventEngine.prototype.clear = function() {
        var eventPump, _i, _len, _ref;
        _ref = this.eventPumps;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          eventPump = _ref[_i];
          eventPump.despose();
        }
        return this.eventPumps = [];
      };

      EventEngine.prototype.despose = function() {
        this.stop();
        return this.clear();
      };

      return EventEngine;

    })();
    return EventEngine;
  });

}).call(this);
