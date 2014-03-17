/*! Infopik v0.0.0 | (c) Hatio, Lab. | MIT License */
(function(context) {
  var factories = {}, loaded = {};
  var isArray = Array.isArray || function(obj) {
    return obj.constructor == Array;
  };

  var map = Array.map || function(arr, fn, scope) {
    for (var i = 0, len = arr.length, result = []; i < len; i++) {
      result.push(fn.call(scope, arr[i]));
    }
    return result;
  };

  function define() {
    var args = Array.prototype.slice.call(arguments), dependencies = [], id, factory;
    if (typeof args[0] == 'string') {
      id = args.shift();
    }
    if (isArray(args[0])) {
      dependencies = args.shift();
    }
    factory = args.shift();
    factories[id] = [dependencies, factory];
  }

  function require(id) {
    function resolve(dep) {
      var relativeParts = id.split('/'), depParts = dep.split('/'), relative = false;
      relativeParts.pop();
      while (depParts[0] == '..' && relativeParts.length) {
        relativeParts.pop();
        depParts.shift();
        relative = true;
      }
      if (depParts[0] == '.') {
        depParts.shift();
        relative = true;
      }
      if (relative) {
        depParts = relativeParts.concat(depParts);
      }
      return depParts.join('/');
    }

    var unresolved, factory, dependencies;
    if (typeof loaded[id] == 'undefined') {
      unresolved = factories[id];
      if (unresolved) {
        dependencies = unresolved[0];
        factory = unresolved[1];
        loaded[id] = factory.apply(undefined, map(dependencies, function(id) {
          return require(resolve(id));
        }));
      }
    }

    return loaded[id];
  }

(function () {
    define('build/Component', ['dou'], function (dou) {
        'use strict';
        var Component;
        Component = function () {
            function Component(type) {
                this.type = type;
            }
            return Component;
        }();
        return dou.mixin(Component, [
            dou['with'].advice,
            dou['with'].event,
            dou['with'].property,
            dou['with'].lifecycle,
            dou['with'].serialize
        ]);
    });
}.call(this));
(function () {
    var __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    define('build/Container', [
        'dou',
        './Component'
    ], function (dou, Component) {
        'use strict';
        var Container, add, add_component, forEach, getAt, indexOf, remove, remove_component, size;
        add_component = function (container, component) {
            var index;
            index = container.__components__.push(component) - 1;
            container.trigger('add', container, component, index);
            if (!(component instanceof Component)) {
                return;
            }
            component.delegate_on(container);
            return component.trigger('added', container, component, index);
        };
        remove_component = function (container, component) {
            var idx;
            idx = container.__components__.indexOf(component);
            if (idx === -1) {
                return;
            }
            if (idx > -1) {
                container.__components__.splice(idx, 1);
            }
            container.trigger('remove', container, component);
            if (!(component instanceof Component)) {
                return;
            }
            component.trigger('removed', container, component);
            return component.delegate_off(container);
        };
        add = function (comp) {
            var i, _i, _len;
            this.__components__ || (this.__components__ = []);
            if (!(comp instanceof Array)) {
                return add.call(this, [comp]);
            }
            if (this.__components__.indexOf(i) === -1) {
                for (_i = 0, _len = comp.length; _i < _len; _i++) {
                    i = comp[_i];
                    add_component(this, i);
                }
            }
            return this;
        };
        remove = function (comp) {
            var i, _i, _len;
            if (!(comp instanceof Array)) {
                return remove.call(this, [comp]);
            }
            if (!this.__components__) {
                return;
            }
            for (_i = 0, _len = comp.length; _i < _len; _i++) {
                i = comp[_i];
                remove_component(this, i);
            }
            return this;
        };
        getAt = function (index) {
            if (this.__components__) {
                return this.__components__[index];
            }
        };
        forEach = function (fn, context) {
            if (!this.__components__) {
                return;
            }
            return this.__components__.forEach(fn, context);
        };
        indexOf = function (item) {
            return (this.__components__ || []).indexOf(item);
        };
        size = function () {
            return (this.__components__ || []).length;
        };
        Container = function (_super) {
            __extends(Container, _super);
            function Container(type) {
                Container.__super__.constructor.call(this, type);
            }
            Container.prototype.add = add;
            Container.prototype.remove = remove;
            Container.prototype.size = size;
            Container.prototype.getAt = getAt;
            Container.prototype.indexOf = indexOf;
            Container.prototype.forEach = forEach;
            return Container;
        }(Component);
        return dou.mixin(Container, [
            dou['with'].advice,
            dou['with'].lifecycle
        ]);
    });
}.call(this));
(function () {
    define('build/ComponentSelector', [
        'dou',
        './Component',
        './Container'
    ], function (dou, Component, Container) {
        'use strict';
        var match, match_by_id, match_by_name, match_by_special, match_by_type, select, select_recurse;
        match_by_id = function (selector, component, listener, root) {
            return selector.substr(1) === component.get('id');
        };
        match_by_name = function (selector, component, listener, root) {
            return selector.substr(1) === component.get('name');
        };
        match_by_special = function (selector, component, listener, root) {
            switch (selector) {
            case '(all)':
                return true;
            case '(self)':
                console.log('listener', listener);
                console.log('component', component);
                return listener === component;
            case '(root)':
                return root === component;
            default:
                return false;
            }
        };
        match_by_type = function (selector, component, listener, root) {
            return selector === 'all' || selector === component.type;
        };
        match = function (selector, component, listener, root) {
            switch (selector.charAt(0)) {
            case '#':
                return match_by_id(selector, component, listener, root);
            case '.':
                return match_by_name(selector, component, listener, root);
            case '(':
                return match_by_special(selector, component, listener, root);
            default:
                return match_by_type(selector, component, listener, root);
            }
        };
        select_recurse = function (matcher, selector, component, listener, root, result) {
            if (matcher(selector, component, listener, root)) {
                result.push(component);
            }
            if (component instanceof Container) {
                component.forEach(function (child) {
                    return select_recurse(matcher, selector, child, listener, root, result);
                });
            }
            return result;
        };
        select = function (selector, component, listener) {
            var matcher;
            if (selector === '(root)') {
                return [component];
            }
            if (selector === '(self)') {
                return [listener];
            }
            matcher = function () {
                switch (selector.charAt(0)) {
                case '#':
                    return match_by_id;
                case '.':
                    return match_by_name;
                case '(':
                    return match_by_special;
                default:
                    return match_by_type;
                }
            }();
            return select_recurse(matcher, selector, component, listener, component, []);
        };
        return {
            select: select,
            match: match
        };
    });
}.call(this));
(function () {
    var __hasProp = {}.hasOwnProperty;
    define('build/EventPump', [
        'dou',
        './ComponentSelector'
    ], function (dou, ComponentSelector) {
        'use strict';
        var EventPump, control, event_handler_fn;
        control = function (root, listener, handlers, event, args) {
            var event_map, event_name, handler, selector, _results;
            _results = [];
            for (selector in handlers) {
                if (!__hasProp.call(handlers, selector))
                    continue;
                event_map = handlers[selector];
                if (ComponentSelector.match(selector, event.origin, listener, root)) {
                    _results.push(function () {
                        var _results1;
                        _results1 = [];
                        for (event_name in event_map) {
                            if (!__hasProp.call(event_map, event_name))
                                continue;
                            handler = event_map[event_name];
                            if (!(event_name === event.name)) {
                                continue;
                            }
                            event.listener = listener;
                            _results1.push(handler.apply(this, args));
                        }
                        return _results1;
                    }.call(this));
                }
            }
            return _results;
        };
        event_handler_fn = function () {
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
        EventPump = function () {
            function EventPump(deliverer) {
                this.setDeliverer(deliverer);
                this.listeners = [];
            }
            EventPump.prototype.setDeliverer = function (deliverer) {
                return this.deliverer = deliverer;
            };
            EventPump.prototype.start = function (context) {
                return this.deliverer.on('all', event_handler_fn, {
                    context: context || null,
                    eventPump: this
                });
            };
            EventPump.prototype.stop = function () {
                return this.deliverer.off('all', event_handler_fn);
            };
            EventPump.prototype.on = function (listener, handlers) {
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
                        console.log('EventPump#on', 'variable ' + selector + ' is not evaluated on listener');
                    }
                }
                return this.listeners.push({
                    listener: listener,
                    handlers: handlers,
                    clonedHandlers: clonedHandlers
                });
            };
            EventPump.prototype.off = function (listener, handlers) {
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
            EventPump.prototype.despose = function () {
                this.stop();
                this.clear();
                return this.deliverer = null;
            };
            return EventPump;
        }();
        return EventPump;
    });
}.call(this));
(function () {
    var __hasProp = {}.hasOwnProperty;
    define('build/EventEngine', [
        'dou',
        './EventPump',
        './ComponentSelector'
    ], function (dou, EventPump, ComponentSelector) {
        'use strict';
        var EventEngine;
        EventEngine = function () {
            function EventEngine(root) {
                this.eventPumps = [];
                this.setRoot(root);
            }
            EventEngine.prototype.setRoot = function (root) {
                return this.root = root;
            };
            EventEngine.prototype.stop = function () {
                var item, _i, _len, _ref, _results;
                _ref = this.eventPumps;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    item = _ref[_i];
                    _results.push(item.eventPump.stop());
                }
                return _results;
            };
            EventEngine.prototype.add = function (listener, handlerMap, context) {
                var eventPump, handlers, selector, target, targets, _results;
                if (!this.root) {
                    return;
                }
                _results = [];
                for (selector in handlerMap) {
                    if (!__hasProp.call(handlerMap, selector))
                        continue;
                    handlers = handlerMap[selector];
                    targets = ComponentSelector.select(selector, this.root, listener);
                    if (selector === '(self)') {
                        console.log(listener === targets[0]);
                        console.log(listener, targets[0]);
                    }
                    _results.push(function () {
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
                    }.call(this));
                }
                return _results;
            };
            EventEngine.prototype.remove = function (listener, handlerMap) {
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
            EventEngine.prototype.clear = function () {
                var eventPump, _i, _len, _ref;
                _ref = this.eventPumps;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    eventPump = _ref[_i];
                    eventPump.despose();
                }
                return this.eventPumps = [];
            };
            EventEngine.prototype.despose = function () {
                this.stop();
                return this.clear();
            };
            return EventEngine;
        }();
        return EventEngine;
    });
}.call(this));
(function () {
    var __hasProp = {}.hasOwnProperty;
    define('build/EventTracker', [], function () {
        'use strict';
        var EventTracker, StandAloneTracker;
        StandAloneTracker = function () {
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
                    if (!__hasProp.call(handlers, ev))
                        continue;
                    handler = handlers[ev];
                    if (typeof handler === 'function') {
                        this.boundhandler[ev] = handler.bind(self);
                    }
                }
            }
            StandAloneTracker.prototype.on = function () {
                var ev, handler, _ref;
                if (this.started) {
                    return;
                }
                _ref = this.boundhandler;
                for (ev in _ref) {
                    if (!__hasProp.call(_ref, ev))
                        continue;
                    handler = _ref[ev];
                    this.target.on(ev, handler);
                }
                return this.started = true;
            };
            StandAloneTracker.prototype.off = function () {
                var ev, handler, _ref;
                _ref = this.boundhandler;
                for (ev in _ref) {
                    if (!__hasProp.call(_ref, ev))
                        continue;
                    handler = _ref[ev];
                    this.target.off(ev, handler);
                }
                return this.started = false;
            };
            return StandAloneTracker;
        }();
        return EventTracker = function () {
            function EventTracker() {
                this.trackers = [];
            }
            EventTracker.prototype.on = function (target, handlers, self) {
                var tracker;
                tracker = new StandAloneTracker(target, handlers, self);
                this.trackers.push(tracker);
                return tracker.on();
            };
            EventTracker.prototype.off = function (target, handlers) {
                var i, idx, idxs, tracker, _i, _len, _ref, _results;
                idxs = function () {
                    var _i, _len, _ref, _results;
                    _ref = this.trackers;
                    _results = [];
                    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                        tracker = _ref[i];
                        if (target === tracker.target && (!handlers || handlers === tracker.handlers)) {
                            _results.push(i);
                        }
                    }
                    return _results;
                }.call(this);
                _ref = idxs.reverse();
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    idx = _ref[_i];
                    _results.push(this.trackers.splice(idx, 1)[0].off());
                }
                return _results;
            };
            EventTracker.prototype.all = function () {
                var tracker, _i, _len, _ref, _results;
                _ref = this.trackers;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    tracker = _ref[_i];
                    _results.push(tracker);
                }
                return _results;
            };
            EventTracker.prototype.despose = function () {
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
        }();
    });
}.call(this));
(function () {
    define('build/ComponentFactory', [
        'dou',
        './Component',
        './Container',
        './EventEngine',
        './EventTracker'
    ], function (dou, Component, Container, EventEngine, EventTracker) {
        'use strict';
        var ComponentFactory;
        ComponentFactory = function () {
            function ComponentFactory(componentRegistry, eventEngine, eventTracker) {
                this.componentRegistry = componentRegistry;
                this.eventEngine = eventEngine;
                this.eventTracker = eventTracker;
                this.seed = 1;
            }
            ComponentFactory.prototype.despose = function () {
                this.componentRegistry = null;
                if (this.eventEngine) {
                    return this.eventEngine.despose();
                }
            };
            ComponentFactory.prototype.uniqueId = function () {
                return 'noid-' + this.seed++;
            };
            ComponentFactory.prototype.createView = function (component, context) {
                var spec, type, view;
                type = component.type;
                spec = this.componentRegistry.get(type);
                if (!spec) {
                    throw new Error('Component Spec Not Found for type \'' + type + '\'');
                }
                view = spec.view_factory_fn.call(context, component.getAll());
                if (component instanceof Container) {
                    component.forEach(function (child) {
                        return view.add(this.createView(child, context));
                    }, this);
                }
                if (spec.view_listener) {
                    this.eventTracker.on(view, spec.view_listener, context);
                }
                return view;
            };
            ComponentFactory.prototype.createComponent = function (obj, context) {
                var child, component, spec, _i, _j, _len, _len1, _ref, _ref1;
                spec = this.componentRegistry.get(obj.type);
                if (!spec) {
                    throw new Error('Component Spec Not Found for type \'' + obj.type + '\'');
                }
                if (spec.containable) {
                    component = new Container(obj.type);
                    if (spec.components) {
                        _ref = spec.components;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            child = _ref[_i];
                            component.add(this.createComponent(child, context));
                        }
                    }
                    if (obj.components) {
                        _ref1 = obj.components;
                        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                            child = _ref1[_j];
                            component.add(this.createComponent(child, context));
                        }
                    }
                } else {
                    component = new Component(obj.type);
                }
                component.initialize(dou.util.shallow_merge(spec.defaults || {}, obj.attrs || {}));
                if (!component.get('id')) {
                    component.set('id', this.uniqueId());
                }
                if (spec.controller) {
                    this.eventEngine.add(component, spec.controller, context);
                }
                return component;
            };
            return ComponentFactory;
        }();
        return ComponentFactory;
    });
}.call(this));
(function () {
    define('build/Command', ['dou'], function (dou) {
        'use strict';
        var Command;
        Command = function () {
            function Command(params) {
                this.params = dou.util.clone(params);
            }
            Command.prototype.execute = function () {
            };
            Command.prototype.unexecute = function () {
            };
            return Command;
        }();
        return Command;
    });
}.call(this));
(function () {
    define('build/CommandManager', ['./Command'], function (Command) {
        'use strict';
        var CommandManager;
        CommandManager = function () {
            function CommandManager(params) {
                this.reset();
            }
            CommandManager.prototype.despose = function () {
                return this.reset();
            };
            CommandManager.prototype.execute = function (command) {
                if (!command instanceof Command) {
                    return;
                }
                command.execute();
                this.exq.push(command);
                return this.uxq = [];
            };
            CommandManager.prototype.undo = function () {
                var command;
                command = this.exq.pop();
                if (command) {
                    command.unexecute();
                    return this.uxq.push(command);
                }
            };
            CommandManager.prototype.redo = function () {
                var command;
                command = this.uxq.pop();
                if (command) {
                    command.execute();
                    return this.exq.push(command);
                }
            };
            CommandManager.prototype.undoable = function () {
                return this.exq.length > 0;
            };
            CommandManager.prototype.redoable = function () {
                return this.uxq.length > 0;
            };
            CommandManager.prototype.reset = function () {
                this.exq = [];
                return this.uxq = [];
            };
            return CommandManager;
        }();
        return CommandManager;
    });
}.call(this));
(function () {
    var __hasProp = {}.hasOwnProperty;
    define('build/EventController', [
        'dou',
        './ComponentSelector'
    ], function (dou, ComponentSelector) {
        'use strict';
        var EventController, control, event_handler_fn;
        control = function (handler_map, event, args) {
            var event_map, event_name, handler, selector, _results;
            _results = [];
            for (selector in handler_map) {
                if (!__hasProp.call(handler_map, selector))
                    continue;
                event_map = handler_map[selector];
                if (ComponentSelector.match(selector, event.origin)) {
                    _results.push(function () {
                        var _results1;
                        _results1 = [];
                        for (event_name in event_map) {
                            if (!__hasProp.call(event_map, event_name))
                                continue;
                            handler = event_map[event_name];
                            if (event_name === event.name) {
                                _results1.push(handler.apply(this, args));
                            }
                        }
                        return _results1;
                    }.call(this));
                }
            }
            return _results;
        };
        event_handler_fn = function () {
            var args, e;
            args = arguments;
            e = args[args.length - 1];
            return this.controllers.forEach(function (handler_map) {
                return control.call(this, handler_map, e, args);
            }, this.context);
        };
        EventController = function () {
            function EventController(target) {
                this.setTarget(target);
            }
            EventController.prototype.setTarget = function (target) {
                return this.target = target;
            };
            EventController.prototype.start = function (context) {
                return this.target.on('all', event_handler_fn, {
                    context: context || null,
                    controllers: this
                });
            };
            EventController.prototype.stop = function () {
                return this.target.off('all', event_handler_fn);
            };
            EventController.prototype.despose = function () {
                this.stop();
                this.clear();
                return this.target = null;
            };
            return EventController;
        }();
        dou.mixin(EventController, dou['with'].collection.withList);
        return EventController;
    });
}.call(this));
(function () {
    var __hasProp = {}.hasOwnProperty;
    define('build/ComponentRegistry', [
        'dou',
        './EventController'
    ], function (dou, EventController) {
        'use strict';
        var ComponentRegistry;
        return ComponentRegistry = function () {
            function ComponentRegistry() {
                this.componentSpecs = {};
            }
            ComponentRegistry.prototype.despose = function () {
                var keys, type, _i, _len, _results;
                keys = Object.keys(this.componentSpecs);
                _results = [];
                for (_i = 0, _len = keys.length; _i < _len; _i++) {
                    type = keys[_i];
                    _results.push(this.unregister(type));
                }
                return _results;
            };
            ComponentRegistry.prototype.setRegisterCallback = function (callback, context) {
                return this.callback_register = typeof callback === 'function' ? callback.bind(context) : void 0;
            };
            ComponentRegistry.prototype.setUnregisterCallback = function (callback, context) {
                return this.callback_unregister = typeof callback === 'function' ? callback.bind(context) : void 0;
            };
            ComponentRegistry.prototype.register = function (componentSpec) {
                var depspec, name, _ref;
                if (this.componentSpecs[componentSpec.type]) {
                    return;
                }
                if (componentSpec.dependencies) {
                    _ref = componentSpec.dependencies;
                    for (name in _ref) {
                        depspec = _ref[name];
                        this.register(depspec);
                    }
                }
                this.componentSpecs[componentSpec.type] = componentSpec;
                if (this.callback_register) {
                    return this.callback_register(componentSpec);
                }
            };
            ComponentRegistry.prototype.unregister = function (type) {
                var spec;
                spec = this.componentSpecs[type];
                if (!spec) {
                    return;
                }
                delete this.componentSpecs[type];
                if (this.callback_unregister) {
                    this.callback_unregister(spec);
                }
                return spec;
            };
            ComponentRegistry.prototype.forEach = function (fn, context) {
                var name, spec, _ref, _results;
                _ref = this.componentSpecs;
                _results = [];
                for (name in _ref) {
                    if (!__hasProp.call(_ref, name))
                        continue;
                    spec = _ref[name];
                    _results.push(fn.call(context, name, spec));
                }
                return _results;
            };
            ComponentRegistry.prototype.list = function (filter) {
                return Object.keys(this.componentSpecs).map(function (key) {
                    return this.componentSpecs[key];
                }, this);
            };
            ComponentRegistry.prototype.get = function (type) {
                var spec;
                spec = this.componentSpecs[type];
                if (spec) {
                    return dou.util.clone(this.componentSpecs[type]);
                } else {
                    return null;
                }
            };
            return ComponentRegistry;
        }();
    });
}.call(this));
(function () {
    define('build/SelectionManager', ['dou'], function (dou) {
        'use strict';
        var SelectionManager;
        return SelectionManager = function () {
            function SelectionManager(config) {
                this.onselectionchange = config.onselectionchange;
                this.context = config.context;
                this.selections = [];
            }
            SelectionManager.prototype.focus = function (target) {
                var idx, old_sels;
                if (!target) {
                    return this.selections[0];
                }
                idx = this.selections.indexOf(target);
                if (idx > -1) {
                    old_sels = dou.util.clone(this.selections);
                    this.selections.splice(idx, 1);
                    this.selections.unshift(target);
                    if (this.onselectionchange) {
                        return this.onselectionchange.call(this.context, {
                            added: [],
                            removed: [],
                            before: old_sels,
                            after: this.selections
                        });
                    }
                } else {
                    return this.toggle(target);
                }
            };
            SelectionManager.prototype.get = function () {
                return dou.util.clone(this.selections);
            };
            SelectionManager.prototype.toggle = function (target) {
                var added, idx, old_sels, removed;
                if (!target) {
                    return;
                }
                old_sels = dou.util.clone(this.selections);
                idx = this.selections.indexOf(target);
                if (idx > -1) {
                    removed = this.selections.splice(idx, 1);
                } else {
                    added = [target];
                    this.selections.unshift(target);
                }
                if (this.onselectionchange) {
                    return this.onselectionchange.call(this.context, {
                        added: added || [],
                        removed: removed || [],
                        before: old_sels,
                        after: this.selections
                    });
                }
            };
            SelectionManager.prototype.select = function (target) {
                var added, item, old_sels, removed;
                old_sels = dou.util.clone(this.selections);
                if (!(target instanceof Array)) {
                    target = !target ? [] : [target];
                }
                this.selections = target;
                added = function () {
                    var _i, _len, _ref, _results;
                    _ref = this.selections;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        item = _ref[_i];
                        if (old_sels.indexOf(item) === -1) {
                            _results.push(item);
                        }
                    }
                    return _results;
                }.call(this);
                removed = function () {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = old_sels.length; _i < _len; _i++) {
                        item = old_sels[_i];
                        if (this.selections.indexOf(item) === -1) {
                            _results.push(item);
                        }
                    }
                    return _results;
                }.call(this);
                if (this.onselectionchange) {
                    return this.onselectionchange.call(this.context, {
                        added: added,
                        removed: removed,
                        before: old_sels,
                        after: this.selections
                    });
                }
            };
            SelectionManager.prototype.reset = function () {
                var old_sels;
                old_sels = this.selections;
                this.selections = [];
                if (old_sels.length > 0 && this.onselectionchange) {
                    return this.onselectionchange.call(this.context, {
                        added: [],
                        removed: old_sels,
                        before: old_sels,
                        after: this.selections
                    });
                }
            };
            return SelectionManager;
        }();
    });
}.call(this));
(function () {
    define('build/ComponentSpec', ['dou'], function (dou) {
        'use strict';
        var ComponentSpec;
        return ComponentSpec = function () {
            function ComponentSpec(config) {
                this.urn = config.urn;
                this.name = config.name;
                this.description = config.description;
                this.defaults = config.defaults;
                this.view_factory = config.view_factory;
                this.handle_factory = config.handle_factory;
                this.toolbox_image = config.toolbox_image;
            }
            return ComponentSpec;
        }();
    });
}.call(this));
(function () {
    define('build/spec/SpecInfographic', [
        'dou',
        'KineticJS'
    ], function (dou, kin) {
        'use strict';
        var createHandle, createView;
        createView = function (attributes) {
            return new kin.Group(attributes);
        };
        createHandle = function (attributes) {
            return new Kin.Group(attributes);
        };
        return {
            type: 'infographic',
            name: 'infographic',
            containable: true,
            container_type: 'container',
            description: 'Infographic Specification',
            defaults: { draggable: false },
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_infographic.png'
        };
    });
}.call(this));
(function () {
    var __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    define('build/command/CommandPropertyChange', [
        'dou',
        '../Command'
    ], function (dou, Command) {
        'use strict';
        var CommandPropertyChange;
        return CommandPropertyChange = function (_super) {
            __extends(CommandPropertyChange, _super);
            function CommandPropertyChange() {
                return CommandPropertyChange.__super__.constructor.apply(this, arguments);
            }
            CommandPropertyChange.prototype.execute = function () {
                var change, _i, _len, _ref, _results;
                _ref = this.params.changes;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    change = _ref[_i];
                    if (change.property) {
                        _results.push(change.component.set(change.property, change.after));
                    } else {
                        _results.push(change.component.set(change.after));
                    }
                }
                return _results;
            };
            CommandPropertyChange.prototype.unexecute = function () {
                var change, _i, _len, _ref, _results;
                _ref = this.params.changes;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    change = _ref[_i];
                    if (change.property) {
                        _results.push(change.component.set(change.property, change.before));
                    } else {
                        _results.push(change.component.set(change.before));
                    }
                }
                return _results;
            };
            return CommandPropertyChange;
        }(Command);
    });
}.call(this));
(function () {
    define('build/spec/SpecContentEditLayer', [
        'dou',
        'KineticJS',
        '../EventTracker',
        '../ComponentSelector',
        '../command/CommandPropertyChange'
    ], function (dou, kin, EventTracker, ComponentSelector, CommandPropertyChange) {
        'use strict';
        var controller, createView, draghandler, onadded, onchange, onchangemodel, onchangeselections, onremoved, view_listener;
        draghandler = {
            dragstart: function (e) {
                var background, layer_offset, mode, offset;
                if (e.targetNode && e.targetNode !== this.background) {
                    return;
                }
                background = this.background;
                layer_offset = this.layer.offset();
                background.setAttrs({
                    x: layer_offset.x + 20,
                    y: layer_offset.y + 20
                });
                this.start_point = {
                    x: e.offsetX,
                    y: e.offsetY
                };
                this.origin_offset = this.layer.offset();
                offset = {
                    x: this.start_point.x + this.origin_offset.x,
                    y: this.start_point.y + this.origin_offset.y
                };
                mode = 'MOVE';
                if (mode === 'SELECT') {
                    this.selectbox = new kin.Rect({
                        stroke: 'black',
                        strokeWidth: 1,
                        dash: [
                            3,
                            3
                        ]
                    });
                    this.layer.add(this.selectbox);
                    this.selectbox.setAttrs(offset);
                } else if (mode === 'MOVE') {
                } else {
                }
                this.layer.draw();
                return e.cancelBubble = true;
            },
            dragmove: function (e) {
                var background, mode, x, y;
                if (e.targetNode && e.targetNode !== this.background) {
                    return;
                }
                background = this.background;
                mode = 'MOVE';
                if (mode === 'SELECT') {
                    background.setAttrs({
                        x: this.origin_offset.x + 20,
                        y: this.origin_offset.y + 20
                    });
                    this.selectbox.setAttrs({
                        width: e.offsetX - this.start_point.x,
                        height: e.offsetY - this.start_point.y
                    });
                } else if (mode === 'MOVE') {
                    x = this.origin_offset.x - (e.offsetX - this.start_point.x);
                    y = this.origin_offset.y - (e.offsetY - this.start_point.y);
                    this.layer.offset({
                        x: x,
                        y: y
                    });
                    this.background.setAttrs({
                        x: x + 20,
                        y: y + 20
                    });
                    this.layer.fire('change-offset', {
                        x: x,
                        y: y
                    }, false);
                } else {
                }
                this.layer.draw();
                return e.cancelBubble = true;
            },
            dragend: function (e) {
                var background, mode, x, y;
                if (e.targetNode && e.targetNode !== this.background) {
                    return;
                }
                background = this.background;
                mode = 'MOVE';
                if (mode === 'SELECT') {
                    background.setAttrs({
                        x: this.origin_offset.x + 20,
                        y: this.origin_offset.y + 20
                    });
                    this.selectbox.remove();
                    delete this.selectbox;
                } else if (mode === 'MOVE') {
                    x = Math.max(this.origin_offset.x - (e.offsetX - this.start_point.x), -20);
                    y = Math.max(this.origin_offset.y - (e.offsetY - this.start_point.y), -20);
                    this.layer.offset({
                        x: x,
                        y: y
                    });
                    this.background.setAttrs({
                        x: x + 20,
                        y: y + 20
                    });
                    this.layer.fire('change-offset', {
                        x: x,
                        y: y
                    }, false);
                } else {
                }
                this.layer.draw();
                return e.cancelBubble = true;
            }
        };
        createView = function (attributes) {
            var background, layer, offset, stage;
            stage = this.getView().getStage();
            offset = attributes.offset || {
                x: 0,
                y: 0
            };
            layer = new kin.Layer(attributes);
            background = new kin.Rect({
                draggable: true,
                listening: true,
                x: 0,
                y: 0,
                width: Math.min(stage.width() + offset.x, stage.width()),
                height: Math.min(stage.height() + offset.y, stage.height()),
                stroke: attributes.stroke,
                fill: 'cyan'
            });
            layer.add(background);
            this.getEventTracker().on(layer, draghandler, {
                layer: layer,
                background: background
            });
            return layer;
        };
        onadded = function (container, component, index, e) {
        };
        onremoved = function (container, component, e) {
        };
        onchangemodel = function (after, before, e) {
            var layer;
            layer = e.listener;
            if (before) {
                layer.remove(before);
            }
            if (after) {
                layer.add(after);
            }
            return this.findView('#' + layer.get('id'));
        };
        onchangeselections = function (after, before, added, removed) {
            return console.log('selection-changed', after);
        };
        onchange = function (component, before, after) {
        };
        controller = {
            '(root)': {
                '(root)': {
                    'change-model': onchangemodel,
                    'change-selections': onchangeselections
                }
            },
            '(self)': {
                '(self)': {
                    'added': onadded,
                    'removed': onremoved
                },
                '(all)': { 'change': onchange }
            }
        };
        view_listener = {
            dragstart: function (e) {
            },
            dragmove: function (e) {
            },
            dragend: function (e) {
                var cmd, component, id, node;
                node = e.targetNode;
                id = e.targetNode.getAttr('id');
                component = this.findComponent('#' + id)[0];
                if (!component) {
                    return;
                }
                cmd = new CommandPropertyChange({
                    changes: [{
                            component: component,
                            before: {
                                x: component.get('x'),
                                y: component.get('y')
                            },
                            after: {
                                x: node.x(),
                                y: node.y()
                            }
                        }]
                });
                return this.execute(cmd);
            },
            click: function (e) {
                var node;
                node = e.targetNode;
                return this.selectionManager.select(node);
            },
            mouseover: function (e) {
            },
            mousemove: function (e) {
            },
            mouseout: function (e) {
            },
            mouseenter: function (e) {
            },
            mouseleave: function (e) {
            }
        };
        return {
            type: 'content-edit-layer',
            name: 'content-edit-layer',
            containable: true,
            container_type: 'layer',
            description: 'Selection Edit Layer Specification',
            defaults: {
                listening: true,
                draggable: false
            },
            controller: controller,
            view_listener: view_listener,
            view_factory_fn: createView,
            toolbox_image: 'images/toolbox_content_edit_layer.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecGuideLayer', ['KineticJS'], function (kin) {
        'use strict';
        var controller, createView, guide_handler, onadded, onchange, onremoved, view_listener;
        createView = function (attributes) {
            return new kin.Layer(attributes);
        };
        onchange = function (component, before, after, e) {
            var guideLayer, layer, msg, self;
            guideLayer = e.listener;
            if (!guideLayer._track) {
                guideLayer._track = {};
            }
            self = guideLayer._track;
            if (!self.view) {
                self.view = this.findViewByComponent(e.listener)[0];
            }
            layer = self.view;
            self.changes = (self.changes || 0) + 1;
            if (!self.text) {
                self.text = new kin.Text({
                    x: 10,
                    y: 10,
                    listening: false,
                    fontSize: 12,
                    fontFamily: 'Calibri',
                    fill: 'green'
                });
                layer.add(self.text);
            }
            msg = '[ PropertyChange ] ' + component.type + ' : ' + component.get('id') + '\n[ Before ] ' + JSON.stringify(before) + '\n[ After ] ' + JSON.stringify(after);
            self.text.setAttr('text', msg);
            layer.draw();
            return setTimeout(function () {
                var tween;
                if (--self.changes > 0) {
                    return;
                }
                tween = new Kinetic.Tween({
                    node: self.text,
                    opacity: 0,
                    duration: 1,
                    easing: kin.Easings.EaseOut
                });
                tween.play();
                return setTimeout(function () {
                    if (self.changes > 0) {
                        tween.reset();
                        tween.destroy();
                        return;
                    }
                    tween.finish();
                    tween.destroy();
                    self.text.remove();
                    delete self.text;
                    return layer.draw();
                }, 1000);
            }, 5000);
        };
        guide_handler = {
            dragstart: function (e) {
                var layer, layer_offset, node, offset_x, offset_y, textx, texty;
                this.mouse_origin = {
                    x: e.x,
                    y: e.y
                };
                node = e.targetNode;
                this.node_origin = node.getAbsolutePosition();
                layer_offset = this.layer.offset();
                offset_x = this.node_origin.x + layer_offset.x;
                offset_y = this.node_origin.y + layer_offset.y;
                this.vert = new kin.Line({
                    stroke: 'red',
                    tension: 1,
                    points: [
                        offset_x,
                        0,
                        offset_x,
                        this.height
                    ]
                });
                this.hori = new kin.Line({
                    stroke: 'red',
                    tension: 1,
                    points: [
                        0,
                        offset_y,
                        this.width,
                        offset_y
                    ]
                });
                this.text = new kin.Text({
                    listening: false,
                    fontSize: 12,
                    fontFamily: 'Calibri',
                    fill: 'green'
                });
                this.text.setAttr('text', '[ ' + offset_x + '(' + node.x() + '), ' + offset_y + '(' + node.y() + ') ]');
                textx = Math.max(offset_x, 0) > this.text.width() + 10 ? offset_x - (this.text.width() + 10) : Math.max(offset_x + 10, 10);
                texty = Math.max(offset_y, 0) > this.text.height() + 10 ? offset_y - (this.text.height() + 10) : Math.max(offset_y + 10, 10);
                this.text.setAttrs({
                    x: textx,
                    y: texty
                });
                layer = this.layer;
                layer.add(this.vert);
                layer.add(this.hori);
                layer.add(this.text);
                return layer.draw();
            },
            dragmove: function (e) {
                var layer_offset, node, node_new_pos, offset_x, offset_y, textx, texty, x, y;
                node_new_pos = {
                    x: e.x - this.mouse_origin.x + this.node_origin.x,
                    y: e.y - this.mouse_origin.y + this.node_origin.y
                };
                x = Math.round(node_new_pos.x / 10) * 10;
                y = Math.round(node_new_pos.y / 10) * 10;
                node = e.targetNode;
                node.setAbsolutePosition({
                    x: x,
                    y: y
                });
                layer_offset = this.layer.offset();
                offset_x = x + layer_offset.x;
                offset_y = y + layer_offset.y;
                this.vert.setAttrs({
                    points: [
                        offset_x,
                        0,
                        offset_x,
                        this.height
                    ]
                });
                this.hori.setAttrs({
                    points: [
                        0,
                        offset_y,
                        this.width,
                        offset_y
                    ]
                });
                this.text.setAttr('text', '[ ' + offset_x + '(' + node.x() + '), ' + offset_y + '(' + node.y() + ') ]');
                textx = Math.max(offset_x, 0) > this.text.width() + 10 ? offset_x - (this.text.width() + 10) : Math.max(offset_x + 10, 10);
                texty = Math.max(offset_y, 0) > this.text.height() + 10 ? offset_y - (this.text.height() + 10) : Math.max(offset_y + 10, 10);
                this.text.setAttrs({
                    x: textx,
                    y: texty
                });
                return this.layer.draw();
            },
            dragend: function (e) {
                this.vert.remove();
                this.hori.remove();
                this.text.remove();
                return this.layer.draw();
            }
        };
        onadded = function (container, component, index, e) {
            var height, layer, stage, width;
            layer = this.findView('#' + component.get('id'))[0];
            stage = this.getView().getStage();
            width = stage.getWidth();
            height = stage.getHeight();
            return this.getEventTracker().on(this.getView(), guide_handler, {
                layer: layer,
                width: width,
                height: height
            });
        };
        onremoved = function (container, component, e) {
            var app;
            app = this.getView();
            return this.getEventHandler().off(app, guide_handler);
        };
        controller = {
            '(root)': { '(all)': { 'change': onchange } },
            '(self)': {
                '(self)': {
                    'added': onadded,
                    'removed': onremoved
                }
            }
        };
        view_listener = {
            dragmove: function (e) {
                var node;
                return node = e.targetNode;
            }
        };
        return {
            type: 'guide-layer',
            name: 'guide-layer',
            containable: true,
            container_type: 'layer',
            description: 'Editing Guide Specification',
            defaults: { draggable: false },
            controller: controller,
            view_listener: view_listener,
            view_factory_fn: createView,
            toolbox_image: 'images/toolbox_guide_layer.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecRulerLayer', [
        'dou',
        'KineticJS'
    ], function (dou, kin) {
        'use strict';
        var createView;
        createView = function (attributes) {
            var layer, target_comp, target_view;
            layer = new kin.Layer(attributes);
            if (attributes.offset_monitor_target) {
                target_comp = this.findComponent(attributes.offset_monitor_target)[0];
                target_view = this.findViewByComponent(target_comp);
                target_view.on('change-offset', function (e) {
                    var children;
                    if (!layer.__hori__) {
                        children = layer.getChildren().toArray();
                        layer.__hori__ = children[0];
                        layer.__vert__ = children[1];
                    }
                    layer.__hori__.setAttr('zeropos', -e.x);
                    layer.__vert__.setAttr('zeropos', -e.y);
                    return layer.draw();
                });
            }
            return layer;
        };
        return {
            type: 'ruler-layer',
            name: 'ruler-layer',
            containable: true,
            container_type: 'layer',
            description: 'Ruler Layer Specification',
            defaults: { draggable: false },
            view_factory_fn: createView,
            components: [
                {
                    type: 'ruler',
                    attrs: {
                        direction: 'horizontal',
                        margin: [
                            20,
                            0
                        ],
                        opacity: 0.8,
                        x: 0,
                        y: 0,
                        width: 1000,
                        height: 20,
                        zeropos: 20
                    }
                },
                {
                    type: 'ruler',
                    attrs: {
                        direction: 'vertical',
                        margin: [
                            20,
                            0
                        ],
                        opacity: 0.8,
                        x: 0,
                        y: 0,
                        width: 20,
                        height: 1000,
                        zeropos: 20
                    }
                }
            ],
            toolbox_image: 'images/toolbox_ruler_layer.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecHandleLayer', [
        'dou',
        'KineticJS'
    ], function (dou, kin) {
        'use strict';
        var controller, createView, onchangeselection;
        createView = function (attributes) {
            var layer, target_comp, target_view;
            layer = new kin.Layer(attributes);
            layer.handles = {};
            if (attributes.offset_monitor_target) {
                target_comp = this.findComponent(attributes.offset_monitor_target)[0];
                target_view = this.findViewByComponent(target_comp);
                target_view.on('change-offset', function (e) {
                    layer.offset({
                        x: e.x,
                        y: e.y
                    });
                    return layer.draw();
                });
                this.getEventTracker().on(target_view, {
                    dragmove: function (e) {
                        var handle, id;
                        id = e.targetNode.getAttr('id');
                        handle = layer.handles[id];
                        if (handle) {
                            handle.setAbsolutePosition(e.targetNode.getAbsolutePosition());
                            return layer.draw();
                        }
                    },
                    dragend: function (e) {
                        var handle, id;
                        id = e.targetNode.getAttr('id');
                        handle = layer.handles[id];
                        if (handle) {
                            handle.setAbsolutePosition(e.targetNode.getAbsolutePosition());
                            return layer.draw();
                        }
                    }
                }, {});
            }
            return layer;
        };
        onchangeselection = function (after, before, added, removed, e) {
            var container, handle, handle_comp, handle_view, id, layer, node, pos, _i, _j, _len, _len1;
            container = e.listener;
            layer = this.findViewByComponent(container)[0];
            for (_i = 0, _len = removed.length; _i < _len; _i++) {
                node = removed[_i];
                id = node.getAttr('id');
                handle = layer.handles[id];
                handle_comp = this.findComponent('#' + handle.getAttr('id'))[0];
                container.remove(handle_comp);
                delete layer.handles[id];
            }
            for (_j = 0, _len1 = added.length; _j < _len1; _j++) {
                node = added[_j];
                id = node.getAttr('id');
                pos = node.getAbsolutePosition();
                handle_comp = this.createComponent({
                    type: 'handle-checker',
                    attrs: {}
                });
                container.add(handle_comp);
                handle_view = this.findViewByComponent(handle_comp)[0];
                handle_view.setAbsolutePosition(pos);
                layer.handles[id] = handle_view;
            }
            return layer.draw();
        };
        controller = { '(root)': { '(root)': { 'change-selections': onchangeselection } } };
        return {
            type: 'handle-layer',
            name: 'handle-layer',
            containable: true,
            container_type: 'layer',
            description: 'Handle Layer Specification',
            defaults: { draggable: false },
            controller: controller,
            view_factory_fn: createView,
            toolbox_image: 'images/toolbox_handle_layer.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecGroup', [
        'dou',
        'KineticJS'
    ], function (dou, kin) {
        'use strict';
        var createHandle, createView, drag_handler;
        drag_handler = function (e) {
            if (!e.targetNode || e.targetNode === this.__background__) {
                return e.targetNode = this;
            }
        };
        createView = function (attributes) {
            var background, group;
            group = new kin.Group(attributes);
            background = new kin.Rect(dou.util.shallow_merge({}, attributes, {
                draggable: false,
                listening: true,
                x: 0,
                y: 0,
                id: void 0
            }));
            group.add(background);
            if (attributes.draggable) {
                group.on('dragstart dragmove dragend', drag_handler);
                group.__background__ = background;
            }
            return group;
        };
        createHandle = function (attributes) {
            return new Kin.Group(attributes);
        };
        return {
            type: 'group',
            name: 'group',
            containable: true,
            container_type: 'container',
            description: 'Group Specification',
            defaults: {
                width: 100,
                height: 50,
                stroke: 'black',
                strokeWidth: 4,
                draggable: true,
                listening: true,
                opacity: 1
            },
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_group.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecRect', ['KineticJS'], function (kin) {
        'use strict';
        var createHandle, createView;
        createView = function (attributes) {
            return new kin.Rect(attributes);
        };
        createHandle = function (attributes) {
            return new Kin.Rect(attributes);
        };
        return {
            type: 'rectangle',
            name: 'rectangle',
            description: 'Rectangle Specification',
            defaults: {
                width: 100,
                height: 50,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 4
            },
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_rectangle.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecRing', ['KineticJS'], function (kin) {
        'use strict';
        var createHandle, createView;
        createView = function (attributes) {
            return new kin.Ring(attributes);
        };
        createHandle = function (attributes) {
            return new Kin.Ring(attributes);
        };
        return {
            type: 'ring',
            name: 'ring',
            description: 'Ring Specification',
            defaults: {
                innerRadius: 40,
                outerRadius: 80,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 5
            },
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_ring.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecRuler', ['KineticJS'], function (kin) {
        'use strict';
        var PIXEL_PER_MM, createHandle, createView, drawFunc, drawHorizontal, drawVertical;
        PIXEL_PER_MM = 3.779527559;
        drawHorizontal = function (context) {
            var baseY, bottomY, i, marginLeft, marginRight, minusCount, minusWidth, plusCount, plusWidth, startX, x, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3, _results;
            startX = parseInt(this.getAttr('zeropos'));
            marginLeft = this.getAttr('margin')[0];
            marginRight = this.width() - this.getAttr('margin')[1];
            baseY = this.height() - 15;
            bottomY = this.height();
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, this.height());
            context.lineTo(this.width(), this.height());
            context.lineTo(this.width(), 0);
            context.lineTo(0, 0);
            plusWidth = this.width() - startX;
            plusCount = Math.ceil(plusWidth / PIXEL_PER_MM);
            for (i = _i = 0, _ref = plusCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                x = startX + i * PIXEL_PER_MM;
                if (x > marginRight) {
                    break;
                }
                if (x < marginLeft) {
                    continue;
                }
                if (i % 10 === 0) {
                    context.moveTo(x, baseY);
                    context.lineTo(x, bottomY);
                } else if (i % 5 === 0) {
                    context.moveTo(x, baseY + 8);
                    context.lineTo(x, bottomY);
                } else {
                    context.moveTo(x, baseY + 11);
                    context.lineTo(x, bottomY);
                }
            }
            minusWidth = startX;
            minusCount = Math.floor(minusWidth / PIXEL_PER_MM);
            for (i = _j = 1, _ref1 = minusCount - 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
                x = startX - i * PIXEL_PER_MM;
                if (x < marginLeft) {
                    break;
                }
                if (x > marginRight) {
                    continue;
                }
                if (i % 10 === 0) {
                    context.moveTo(x, baseY);
                    context.lineTo(x, bottomY);
                } else if (i % 5 === 0) {
                    context.moveTo(x, baseY + 8);
                    context.lineTo(x, bottomY);
                } else {
                    context.moveTo(x, baseY + 11);
                    context.lineTo(x, bottomY);
                }
            }
            context.closePath();
            context.fillStrokeShape(this);
            for (i = _k = 0, _ref2 = plusCount - 1; _k <= _ref2; i = _k += 10) {
                x = startX + i * PIXEL_PER_MM;
                if (x > marginRight) {
                    break;
                }
                if (x < marginLeft) {
                    continue;
                }
                context.strokeText('' + i / 10, x + 2, baseY + 10);
            }
            _results = [];
            for (i = _l = 10, _ref3 = minusCount - 1; _l <= _ref3; i = _l += 10) {
                x = startX - i * PIXEL_PER_MM;
                if (x < marginLeft) {
                    break;
                }
                if (x > marginRight) {
                    continue;
                }
                _results.push(context.strokeText('-' + i / 10, x + 2, baseY + 10));
            }
            return _results;
        };
        drawVertical = function (context) {
            var baseX, endX, i, marginBottom, marginTop, minusArea, minusCount, plusArea, plusCount, startY, y, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3, _results;
            startY = parseInt(this.getAttr('zeropos'));
            marginTop = this.getAttr('margin')[0];
            marginBottom = this.height() - this.getAttr('margin')[1];
            baseX = this.width() - 15;
            endX = this.width();
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, this.height());
            context.lineTo(this.width(), this.height());
            context.lineTo(this.width(), 0);
            context.lineTo(0, 0);
            plusArea = this.height() - startY;
            plusCount = Math.ceil(plusArea / PIXEL_PER_MM);
            for (i = _i = 0, _ref = plusCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                y = startY + i * PIXEL_PER_MM;
                if (y > marginBottom) {
                    break;
                }
                if (y < marginTop) {
                    continue;
                }
                if (i % 10 === 0) {
                    context.moveTo(baseX, y);
                    context.lineTo(endX, y);
                } else if (i % 5 === 0) {
                    context.moveTo(baseX + 8, y);
                    context.lineTo(endX, y);
                } else {
                    context.moveTo(baseX + 11, y);
                    context.lineTo(endX, y);
                }
            }
            minusArea = startY;
            minusCount = Math.floor(minusArea / PIXEL_PER_MM);
            for (i = _j = 1, _ref1 = minusCount - 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
                y = startY - i * PIXEL_PER_MM;
                if (y > marginBottom) {
                    continue;
                }
                if (y < marginTop) {
                    break;
                }
                if (i % 10 === 0) {
                    context.moveTo(baseX, y);
                    context.lineTo(endX, y);
                } else if (i % 5 === 0) {
                    context.moveTo(baseX + 8, y);
                    context.lineTo(endX, y);
                } else {
                    context.moveTo(baseX + 11, y);
                    context.lineTo(endX, y);
                }
            }
            context.closePath();
            context.fillStrokeShape(this);
            for (i = _k = 0, _ref2 = plusCount - 1; _k <= _ref2; i = _k += 10) {
                y = startY + i * PIXEL_PER_MM;
                if (y > marginBottom) {
                    break;
                }
                if (y < marginTop) {
                    continue;
                }
                context.strokeText('' + i / 10, 1, y + 10);
            }
            _results = [];
            for (i = _l = 10, _ref3 = minusCount - 1; _l <= _ref3; i = _l += 10) {
                y = startY - i * PIXEL_PER_MM;
                if (y < marginTop) {
                    break;
                }
                if (y > marginBottom) {
                    continue;
                }
                _results.push(context.strokeText('-' + i / 10, 1, y + 10));
            }
            return _results;
        };
        drawFunc = function (context) {
            if (this.getAttr('direction') !== 'vertical') {
                return drawHorizontal.apply(this, arguments);
            } else {
                return drawVertical.apply(this, arguments);
            }
        };
        createView = function (attributes) {
            return new Kinetic.Shape(attributes);
        };
        createHandle = function (attributes) {
            return new Kin.Rect(attributes);
        };
        return {
            type: 'ruler',
            name: 'ruler',
            description: 'Ruler Specification',
            defaults: {
                drawFunc: drawFunc,
                fill: '#848586',
                stroke: '#C2C3C5',
                strokeWidth: 0.5,
                width: 100,
                height: 50,
                margin: [
                    15,
                    15
                ],
                zeropos: 15,
                direction: 'horizontal',
                font: '8px Verdana'
            },
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_ruler.png'
        };
    });
}.call(this));
(function () {
    define('build/handle/HandleChecker', ['KineticJS'], function (kin) {
        'use strict';
        var createHandle, createView;
        createView = function (attributes) {
            return new kin.Rect(attributes);
        };
        createHandle = function (attributes) {
            return new Kin.Rect(attributes);
        };
        return {
            type: 'handle-checker',
            name: 'handle-checker',
            description: 'Checker Handle Specification',
            defaults: {
                width: 10,
                height: 10,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 2
            },
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_handle_checker.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecPainter', [
        'KineticJS',
        './SpecInfographic',
        './SpecContentEditLayer',
        './SpecGuideLayer',
        './SpecRulerLayer',
        './SpecHandleLayer',
        './SpecGroup',
        './SpecRect',
        './SpecRing',
        './SpecRuler',
        '../handle/HandleChecker'
    ], function (kin, SpecInfographic, SpecContentEditLayer, SpecGuideLayer, SpecRulerLayer, SpecHandleLayer, SpecGroup, SpecRect, SpecRing, SpecRuler, HandleChecker) {
        'use strict';
        var controller, createView;
        createView = function (attributes) {
            return new kin.Stage(attributes);
        };
        return controller = {
            type: 'painter-app',
            name: 'painter-app',
            containable: true,
            container_type: 'application',
            description: 'Painter Application Specification',
            defaults: {},
            controller: controller,
            view_factory_fn: createView,
            dependencies: {
                'infographic': SpecInfographic,
                'content-edit-layer': SpecContentEditLayer,
                'guide-layer': SpecGuideLayer,
                'ruler-layer': SpecRulerLayer,
                'handle-layer': SpecHandleLayer,
                'group': SpecGroup,
                'rect': SpecRect,
                'ring': SpecRing,
                'ruler': SpecRuler,
                'handle-checker': HandleChecker
            },
            layers: [
                {
                    type: 'content-edit-layer',
                    attrs: {
                        offset: {
                            x: -20,
                            y: -20
                        }
                    }
                },
                {
                    type: 'handle-layer',
                    attrs: {
                        offset_monitor_target: 'content-edit-layer',
                        offset: {
                            x: -20,
                            y: -20
                        }
                    }
                },
                {
                    type: 'guide-layer',
                    attrs: {
                        offset: {
                            x: -20,
                            y: -20
                        }
                    }
                },
                {
                    type: 'ruler-layer',
                    attrs: { offset_monitor_target: 'content-edit-layer' }
                }
            ],
            toolbox_image: 'images/toolbox_painter_app.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecContentViewLayer', [
        'KineticJS',
        '../EventTracker',
        '../ComponentSelector',
        '../command/CommandPropertyChange'
    ], function (kin, EventTracker, ComponentSelector, CommandPropertyChange) {
        'use strict';
        var controller, createView, onadded, onchange, onchangemodel, onremoved, view_listener;
        createView = function (attributes) {
            return new kin.Layer(attributes);
        };
        onadded = function (container, component, index, e) {
        };
        onremoved = function (container, component, e) {
        };
        onchangemodel = function (after, before) {
            var layer, _i, _len, _ref, _results;
            _ref = this.findComponent('content-view-layer');
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                layer = _ref[_i];
                if (before) {
                    layer.remove(before);
                }
                if (after) {
                    layer.add(after);
                }
                _results.push(this.findView('#' + layer.get('id')));
            }
            return _results;
        };
        onchange = function (component, before, after) {
            var view;
            view = this.findViewByComponent(component);
            view.setAttrs(after);
            return this.drawView();
        };
        controller = {
            '(root)': { '(root)': { 'change-model': onchangemodel } },
            '(self)': {
                '(all)': { 'change': onchange },
                '(self)': { 'change': onchange }
            }
        };
        view_listener = {
            click: function (e) {
                var node;
                node = e.targetNode;
                return this.selectionManager.select(node);
            }
        };
        return {
            type: 'content-view-layer',
            name: 'content-view-layer',
            containable: true,
            container_type: 'layer',
            description: 'Content View Layer Specification',
            defaults: {},
            controller: controller,
            view_listener: view_listener,
            view_factory_fn: createView,
            toolbox_image: 'images/toolbox_content_view_layer.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecPresenter', [
        'KineticJS',
        './SpecInfographic',
        './SpecContentViewLayer',
        './SpecGroup',
        './SpecRect',
        './SpecRing',
        './SpecRuler'
    ], function (kin, SpecInfographic, SpecContentViewLayer, SpecGroup, SpecRect, SpecRing, SpecRuler) {
        'use strict';
        var controller, createView;
        createView = function (attributes) {
            return new kin.Stage(attributes);
        };
        return controller = {
            type: 'presenter-app',
            name: 'presenter-app',
            containable: true,
            container_type: 'application',
            description: 'Presenter Application Specification',
            defaults: {},
            controller: controller,
            view_factory_fn: createView,
            dependencies: {
                'infographic': SpecInfographic,
                'content-view-layer': SpecContentViewLayer,
                'group': SpecGroup,
                'rect': SpecRect,
                'ring': SpecRing,
                'ruler': SpecRuler
            },
            layers: [{
                    type: 'content-view-layer',
                    attrs: {}
                }],
            toolbox_image: 'images/toolbox_presenter_app.png'
        };
    });
}.call(this));
(function () {
    define('build/ApplicationContext', [
        'dou',
        'KineticJS',
        './Component',
        './Container',
        './EventEngine',
        './EventTracker',
        './ComponentFactory',
        './Command',
        './CommandManager',
        './ComponentRegistry',
        './ComponentSelector',
        './SelectionManager',
        './ComponentSpec',
        './spec/SpecPainter',
        './spec/SpecPresenter',
        './spec/SpecInfographic'
    ], function (dou, kin, Component, Container, EventEngine, EventTracker, ComponentFactory, Command, CommandManager, ComponentRegistry, ComponentSelector, SelectionManager, ComponentSpec, SpecPainter, SpecPresenter, SpecInfographic) {
        'use strict';
        var ApplicationContext;
        ApplicationContext = function () {
            function ApplicationContext(options) {
                var attributes, component, container, _i, _len, _ref;
                this.application_spec = options.application_spec, container = options.container;
                if (typeof container !== 'string') {
                    throw new Error('container is a mandatory string type option.');
                }
                if (!this.application_spec) {
                    throw new Error('application_spec is a mandatory option');
                }
                this.commandManager = new CommandManager();
                this.selectionManager = new SelectionManager({
                    onselectionchange: this.onselectionchange,
                    context: this
                });
                this.eventTracker = new EventTracker();
                this.eventEngine = new EventEngine();
                this.componentRegistry = new ComponentRegistry();
                this.componentRegistry.setRegisterCallback(function (spec) {
                }, this);
                this.componentRegistry.setUnregisterCallback(function (spec) {
                }, this);
                this.componentFactory = new ComponentFactory(this.componentRegistry, this.eventEngine, this.eventTracker, this.eventPump);
                this.componentRegistry.register(this.application_spec);
                attributes = {
                    id: 'application',
                    container: options.container,
                    width: options.width,
                    height: options.height
                };
                this.application = this.componentFactory.createComponent({
                    type: this.application_spec.type,
                    attrs: attributes
                }, this);
                this.view = this.componentFactory.createView(this.application, this);
                this.eventEngine.setRoot(this.application);
                this.application.on('add', this.onadd, this);
                this.application.on('remove', this.onremove, this);
                if (this.application_spec.layers) {
                    _ref = this.application_spec.layers;
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        component = _ref[_i];
                        this.application.add(this.componentFactory.createComponent(component, this));
                    }
                }
            }
            ApplicationContext.prototype.despose = function () {
                this.eventTracker.despose();
                this.eventController.despose();
                this.eventRegistry.despose();
                return this.componentFactory.despose();
            };
            ApplicationContext.prototype.getEventTracker = function () {
                return this.eventTracker;
            };
            ApplicationContext.prototype.getView = function () {
                return this.view;
            };
            ApplicationContext.prototype.getModel = function () {
                return this.model;
            };
            ApplicationContext.prototype.setModel = function (model) {
                var before;
                before = this.model;
                this.model = model;
                return this.application.trigger('change-model', this.model, before);
            };
            ApplicationContext.prototype.getController = function () {
                return this.eventController;
            };
            ApplicationContext.prototype.getApplication = function () {
                return this.application;
            };
            ApplicationContext.prototype.findComponent = function (selector) {
                return ComponentSelector.select(selector, this.application);
            };
            ApplicationContext.prototype.findView = function (selector) {
                return this.view.find(selector);
            };
            ApplicationContext.prototype.findViewByComponent = function (component) {
                return this.view.find('#' + component.get('id'));
            };
            ApplicationContext.prototype.createView = function (component) {
                return this.componentFactory.createView(component, this);
            };
            ApplicationContext.prototype.createComponent = function (obj) {
                return this.componentFactory.createComponent(obj, this);
            };
            ApplicationContext.prototype.drawView = function () {
                return this.view.draw();
            };
            ApplicationContext.prototype.execute = function (command) {
                return this.commandManager.execute(command);
            };
            ApplicationContext.prototype.onadd = function (container, component, index, e) {
                var vcomponent, vcontainer;
                vcontainer = container === this.application ? this.view : this.findViewByComponent(container);
                vcomponent = this.createView(component);
                vcontainer.add(vcomponent);
                return this.drawView();
            };
            ApplicationContext.prototype.onremove = function (container, component, e) {
                var vcomponent;
                console.log('removed', container, component);
                vcomponent = this.findViewByComponent(component);
                console.log('found-component', vcomponent);
                vcomponent.destroy();
                return this.drawView();
            };
            ApplicationContext.prototype.onselectionchange = function (changes) {
                return this.application.trigger('change-selections', changes.after, changes.before, changes.added, changes.removed);
            };
            return ApplicationContext;
        }();
        return ApplicationContext;
    });
}.call(this));
(function () {
    define('build/infopik', ['./ApplicationContext'], function (ApplicationContext) {
        'use strict';
        return {
            app: function (options) {
                return new ApplicationContext(options);
            }
        };
    });
}.call(this));

  context.infopik = require('build/infopik');
}(this));