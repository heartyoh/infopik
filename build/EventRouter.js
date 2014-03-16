(function() {
  var __hasProp = {}.hasOwnProperty;

  define([], function() {
    "use strict";
    var EventController, EventRouter, StandAloneRouter, control, event_handler_fn;
    control = function(handler_map, event, args) {
      var event_map, event_name, handler, selector, _results;
      _results = [];
      for (selector in handler_map) {
        if (!__hasProp.call(handler_map, selector)) continue;
        event_map = handler_map[selector];
        if (ComponentSelector.match(selector, event.target)) {
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
    StandAloneRouter = (function() {
      function StandAloneRouter(target, routeset) {
        var ev, handler;
        this.started = false;
        if (target) {
          this.target = target;
        }
        this.routeset = routeset;
        this.boundhandler = {};
        for (ev in routeset) {
          if (!__hasProp.call(routeset, ev)) continue;
          handler = routeset[ev];
          if (typeof handler === 'function') {
            this.boundhandler[ev] = handler.bind(context);
          }
        }
      }

      StandAloneRouter.prototype.on = function() {
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

      StandAloneRouter.prototype.off = function() {
        var ev, handler, _ref;
        _ref = this.boundhandler;
        for (ev in _ref) {
          if (!__hasProp.call(_ref, ev)) continue;
          handler = _ref[ev];
          this.target.off(ev, handler);
        }
        return this.started = false;
      };

      return StandAloneRouter;

    })();
    EventRouter = (function() {
      function EventRouter(root) {
        this.root = root;
        this.routers = [];
      }

      EventRouter.prototype.on = function(target, routeset) {
        var router;
        router = new StandAloneRouter(target, routeset);
        this.routers.push(router);
        return router.on();
      };

      EventRouter.prototype.off = function(target, routeset) {
        var i, idx, idxs, router, _i, _len, _ref, _results;
        idxs = (function() {
          var _i, _len, _ref, _results;
          _ref = this.routers;
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            router = _ref[i];
            if (target === router.target && ((!routeset) || (routeset === router.routeset))) {
              _results.push(i);
            }
          }
          return _results;
        }).call(this);
        _ref = idxs.reverse();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          idx = _ref[_i];
          _results.push(this.routers.splice(idx, 1)[0].off());
        }
        return _results;
      };

      EventRouter.prototype.all = function() {
        var router, _i, _len, _ref, _results;
        _ref = this.routers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          router = _ref[_i];
          _results.push(router);
        }
        return _results;
      };

      return EventRouter;

    })();
    StandAloneRouter = (function() {
      function StandAloneRouter(target, routeset, context) {
        var ev, handler;
        this.started = false;
        if (target) {
          this.target = target;
        }
        this.routeset = routeset;
        context = context || this.target || this;
        this.boundhandler = {};
        for (ev in routeset) {
          if (!__hasProp.call(routeset, ev)) continue;
          handler = routeset[ev];
          if (typeof handler === 'function') {
            this.boundhandler[ev] = handler.bind(context);
          }
        }
      }

      StandAloneRouter.prototype.on = function() {
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

      StandAloneRouter.prototype.off = function() {
        var ev, handler, _ref;
        _ref = this.boundhandler;
        for (ev in _ref) {
          if (!__hasProp.call(_ref, ev)) continue;
          handler = _ref[ev];
          this.target.off(ev, handler);
        }
        return this.started = false;
      };

      return StandAloneRouter;

    })();
    return EventRouter = (function() {
      function EventRouter() {
        this.routes = [];
      }

      EventRouter.prototype.on = function(target, routeset, context) {
        var route;
        route = new StandAloneRouter(target, routeset, context);
        this.routes.push(route);
        return route.on();
      };

      EventRouter.prototype.off = function(target, routeset) {
        var i, idx, idxs, route, _i, _len, _ref, _results;
        idxs = (function() {
          var _i, _len, _ref, _results;
          _ref = this.routes;
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            route = _ref[i];
            if (target === route.target && ((!routeset) || (routeset === route.routeset))) {
              _results.push(i);
            }
          }
          return _results;
        }).call(this);
        _ref = idxs.reverse();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          idx = _ref[_i];
          _results.push(this.routes.splice(idx, 1)[0].off());
        }
        return _results;
      };

      EventRouter.prototype.all = function() {
        var route, _i, _len, _ref, _results;
        _ref = this.routes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          route = _ref[_i];
          _results.push(route);
        }
        return _results;
      };

      EventRouter.prototype.despose = function() {
        var route, _i, _len, _ref;
        _ref = this.routes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          route = _ref[_i];
          route.off();
        }
        return this.routes = [];
      };

      EventRouter.StandAlone = StandAloneRouter;

      return EventRouter;

    })();
  });

}).call(this);
