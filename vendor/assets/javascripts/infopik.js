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
    define('src/Component', ['dou'], function (dou) {
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
    define('src/Container', [
        'dou',
        './Component'
    ], function (dou, Component) {
        'use strict';
        var Container, add, add_component, forEach, remove, remove_component, select;
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
        select = function (selector) {
            var clone, i, _i, _len, _ref;
            if (!this.__components__) {
                return;
            }
            clone = [];
            if (selector === void 0) {
                _ref = this.__components__;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    i = _ref[_i];
                    clone.push(i);
                }
            }
            return clone;
        };
        forEach = function (fn, context) {
            if (!this.__components__) {
                return;
            }
            return this.__components__.forEach(fn, context);
        };
        Container = function (_super) {
            __extends(Container, _super);
            function Container(type) {
                Container.__super__.constructor.call(this, type);
            }
            Container.prototype.add = add;
            Container.prototype.remove = remove;
            Container.prototype.select = select;
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
    define('src/ComponentSelector', [
        'dou',
        './Component',
        './Container'
    ], function (dou, Component, Container) {
        'use strict';
        var match, match_by_id, match_by_name, match_by_type, select, select_recurse;
        match_by_id = function (selector, component) {
            return selector.substr(1) === component.get('id');
        };
        match_by_name = function (selector, component) {
            return selector.substr(1) === component.get('name');
        };
        match_by_type = function (selector, component) {
            return selector === 'all' || selector === component.type;
        };
        match = function (selector, component) {
            switch (selector.charAt(0)) {
            case '#':
                return match_by_id(selector, component);
            case '.':
                return match_by_name(selector, component);
            default:
                return match_by_type(selector, component);
            }
        };
        select_recurse = function (matcher, selector, component, result) {
            if (matcher(selector, component)) {
                result.push(component);
            }
            if (component instanceof Container) {
                component.forEach(function (child) {
                    return select_recurse(matcher, selector, child, result);
                });
            }
            return result;
        };
        select = function (selector, component) {
            var matcher;
            matcher = function () {
                switch (selector.charAt(0)) {
                case '#':
                    return match_by_id;
                case '.':
                    return match_by_name;
                default:
                    return match_by_type;
                }
            }();
            return select_recurse(matcher, selector, component, []);
        };
        return {
            select: select,
            match: match
        };
    });
}.call(this));
(function () {
    var __hasProp = {}.hasOwnProperty;
    define('src/EventController', [
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
                if (ComponentSelector.match(selector, event.target)) {
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
    define('src/EventTracker', [], function () {
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
    define('src/ComponentFactory', [
        'dou',
        './Component',
        './Container',
        './EventTracker'
    ], function (dou, Component, Container, EventTracker) {
        'use strict';
        var ComponentFactory;
        ComponentFactory = function () {
            function ComponentFactory(componentRegistry, eventTracker) {
                this.componentRegistry = componentRegistry;
                this.eventTracker = eventTracker;
                this.seed = 1;
            }
            ComponentFactory.prototype.despose = function () {
                return this.componentRegistry = null;
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
                view = spec.view_factory_fn(component.getAll());
                if (component instanceof Container) {
                    component.forEach(function (child) {
                        return view.add(this.createView(child));
                    }, this);
                }
                if (spec.view_listener) {
                    this.eventTracker.on(view, spec.view_listener, context);
                }
                return view;
            };
            ComponentFactory.prototype.createComponent = function (type, attributes, context) {
                var component, spec;
                spec = this.componentRegistry.get(type);
                if (!spec) {
                    throw new Error('Component Spec Not Found for type \'' + type + '\'');
                }
                if (spec.containable) {
                    component = new Container(type);
                } else {
                    component = new Component(type);
                }
                component.initialize(dou.util.shallow_merge(spec.defaults || {}, attributes || {}));
                if (!component.get('id')) {
                    component.set('id', this.uniqueId());
                }
                if (spec.component_listener) {
                    this.eventTracker.on(component, spec.component_listener, context);
                }
                return component;
            };
            return ComponentFactory;
        }();
        return ComponentFactory;
    });
}.call(this));
(function () {
    define('src/Command', ['dou'], function (dou) {
        'use strict';
        var Command;
        Command = function () {
            function Command(params) {
                this.params = params;
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
    define('src/CommandManager', ['src/Command'], function (Command) {
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
    define('src/ComponentRegistry', [
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
    define('src/ApplicationContext', [
        'dou',
        'KineticJS',
        './Component',
        './Container',
        './EventController',
        './EventTracker',
        './ComponentFactory',
        './CommandManager',
        './ComponentRegistry',
        './ComponentSelector'
    ], function (dou, kin, Component, Container, EventController, EventTracker, ComponentFactory, CommandManager, ComponentRegistry, ComponentSelector) {
        'use strict';
        var ApplicationContext;
        ApplicationContext = function () {
            function ApplicationContext(options) {
                var attributes, attrs, layer, _ref;
                this.application_spec = options.application_spec, this.html_container = options.html_container;
                if (typeof this.html_container !== 'string') {
                    throw new Error('html_container should be a string.');
                }
                this.commandManager = new CommandManager();
                this.eventTracker = new EventTracker();
                this.eventController = new EventController();
                this.componentRegistry = new ComponentRegistry();
                this.componentRegistry.setRegisterCallback(function (spec) {
                    if (spec.controller) {
                        return this.eventController.append(spec.controller);
                    }
                }, this);
                this.componentRegistry.setUnregisterCallback(function (spec) {
                    if (spec.controller) {
                        return this.eventController.remove(spec.controller);
                    }
                }, this);
                this.componentFactory = new ComponentFactory(this.componentRegistry, this.eventTracker);
                this.componentRegistry.register(this.application_spec);
                attributes = {
                    id: 'application',
                    container: this.html_container,
                    width: 578,
                    height: 200
                };
                this.application = this.componentFactory.createComponent(this.application_spec.type, attributes, this);
                this.view = this.componentFactory.createView(this.application, this);
                this.eventController.setTarget(this.application);
                this.eventController.start(this);
                this.application.on('add', this.onadd, this);
                this.application.on('remove', this.onremove, this);
                if (this.application_spec.layers) {
                    _ref = this.application_spec.layers;
                    for (layer in _ref) {
                        attrs = _ref[layer];
                        this.application.add(this.componentFactory.createComponent(layer, attrs, this));
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
            ApplicationContext.prototype.createComponent = function (type, attrs) {
                return this.componentFactory.createComponent(type, attrs, this);
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
                var vcomponent, vcontainer;
                vcontainer = container === this.application ? this.view : this.findViewByComponent(container);
                vcomponent = this.findViewByComponent(component);
                vcontainer.remove(vcomponent);
                return this.drawView();
            };
            return ApplicationContext;
        }();
        return ApplicationContext;
    });
}.call(this));
(function () {
    define('src/infopik', ['./ApplicationContext'], function (ApplicationContext) {
        'use strict';
        return {
            app: function (options) {
                return new ApplicationContext(options);
            }
        };
    });
}.call(this));

  context.infopik = require('src/infopik');
}(this));