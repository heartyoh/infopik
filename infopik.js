/*! Infopik v0.0.0 | (c) Hatio, Lab. | MIT License */
(function(context) {
  var factories = {
    dou: [[], function() { return context.dou; }],
    bwip: [[], function() { return context.bwip; }],
    KineticJS: [[], function() { return context.Kinetic; }]
  }, loaded = {};
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
    define('build/MVCMixin', ['dou'], function (dou) {
        'use strict';
        var attachView, detachAll, detachView, getModel, getViews, setModel, withController, withModel, withView;
        attachView = function (model, view, x) {
            if (!view) {
                return;
            }
            if (!model.__views__) {
                model.__views__ = [];
            }
            model.__views__.push(view);
            if (x) {
                return setModel(view, model, false);
            }
        };
        detachView = function (model, view, x) {
            var index;
            if (!view || !model.__views__) {
                return;
            }
            index = model.__views__.indexOf(view);
            if (index === -1) {
                return;
            }
            model.__views__.splice(index, 1);
            if (x) {
                return setModel(view, null, false);
            }
        };
        detachAll = function (model) {
            var view, _i, _len, _ref;
            if (!model.__views__) {
                return;
            }
            _ref = model.__views__;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                view = _ref[_i];
                setModel(view, null, false);
            }
            return model.__views__ = null;
        };
        getViews = function (model) {
            var attaches, view, _i, _len, _ref, _results;
            attaches = [];
            if (!model.__views__) {
                return attaches;
            }
            _ref = model.__views__;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                view = _ref[_i];
                _results.push(view);
            }
            return _results;
        };
        setModel = function (view, model, x) {
            var oldModel;
            oldModel = view.__model__;
            if (oldModel === model) {
                return;
            }
            if (oldModel && x) {
                detachView(oldModel, view, false);
            }
            view.__model__ = model;
            if (model && x) {
                return attachView(model, view, false);
            }
        };
        getModel = function (view) {
            return view.__model__;
        };
        withModel = function () {
            this.attachView = function (view) {
                return attachView(this, view, true);
            };
            this.detachView = function (view) {
                return detachView(this, view, true);
            };
            this.detachAll = function () {
                return detachAll(this);
            };
            return this.getViews = function (filter) {
                return getViews(this);
            };
        };
        withView = function () {
            this.getModel = function () {
                return getModel(this);
            };
            return this.setModel = function (model) {
                return setModel(this, model, true);
            };
        };
        withController = function () {
            this.attach = function (model, view) {
                return attachView(model, view, true);
            };
            this.detach = function (model, view) {
                return detachView(model, view, true);
            };
            this.detachAll = function (model) {
                return detachAll(model);
            };
            this.getAttachedModel = function (view) {
                return getModel(view);
            };
            return this.getAttachedViews = function (model) {
                return getViews(model);
            };
        };
        return {
            controller: withController,
            model: withModel,
            view: withView
        };
    });
}.call(this));
(function () {
    define('build/Component', [
        'dou',
        './MVCMixin'
    ], function (dou, MVCMixin) {
        'use strict';
        var Component;
        Component = function () {
            function Component(type, container) {
                this.type = type;
                this.container = container;
            }
            Component.prototype.dispose = function () {
                return this.setContainer(null);
            };
            Component.prototype.getContainer = function () {
                return this.container;
            };
            Component.prototype.setContainer = function (container) {
                if (container === this.container) {
                    return;
                }
                if (this.container) {
                    this.container.remove(this);
                }
                this.container = container;
                if (this.container) {
                    return this.container.add(this);
                }
            };
            Component.prototype.moveAt = function (index) {
                if (!this.getContainer()) {
                    return;
                }
                return this.container.moveChildAt(index, this);
            };
            Component.prototype.moveForward = function () {
                if (!this.getContainer()) {
                    return;
                }
                return this.container.moveChildForward(this);
            };
            Component.prototype.moveBackward = function () {
                if (!this.getContainer()) {
                    return;
                }
                return this.container.moveChildBackward(this);
            };
            Component.prototype.moveToFront = function () {
                if (!this.getContainer()) {
                    return;
                }
                return this.container.moveChildToFront(this);
            };
            Component.prototype.moveToBack = function () {
                if (!this.getContainer()) {
                    return;
                }
                return this.container.moveChildToBack(this);
            };
            return Component;
        }();
        return dou.mixin(Component, [
            dou['with'].advice,
            dou['with'].event,
            dou['with'].property,
            dou['with'].lifecycle,
            dou['with'].serialize,
            dou['with'].disposer,
            MVCMixin.model
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
        var Container, EMPTY, add, add_component, forEach, getAt, indexOf, moveChildAt, moveChildBackward, moveChildForward, moveChildToBack, moveChildToFront, remove, remove_component, size;
        EMPTY = [];
        add_component = function (container, component) {
            var containable, index, oldContainer;
            containable = component instanceof Component;
            if (containable) {
                oldContainer = component.getContainer();
                if (oldContainer) {
                    if (container === oldContainer) {
                        return;
                    }
                    remove_component(container, component);
                }
            }
            index = container.__components__.push(component) - 1;
            if (containable) {
                component.setContainer(container);
            }
            container.trigger('add', container, component, index);
            if (!containable) {
                return;
            }
            component.delegate_on(container);
            return component.trigger('added', container, component, index);
        };
        remove_component = function (container, component) {
            var containable, idx;
            containable = component instanceof Component;
            idx = container.__components__.indexOf(component);
            if (idx === -1) {
                return;
            }
            if (idx > -1) {
                container.__components__.splice(idx, 1);
            }
            if (containable) {
                component.setContainer(null);
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
            return (this.__components__ || EMPTY).indexOf(item);
        };
        size = function () {
            return (this.__components__ || EMPTY).length;
        };
        moveChildAt = function (index, child) {
            var head, oldIndex, tail;
            oldIndex = this.indexOf(child);
            if (oldIndex === -1) {
                return;
            }
            head = this.__components__.splice(0, oldIndex);
            tail = this.__components__.splice(1);
            this.__components__ = head.concat(tail);
            index = Math.max(0, index);
            index = Math.min(index, this.__components__.length);
            head = this.__components__.splice(0, index);
            return this.__components__ = head.concat(child, this.__components__);
        };
        moveChildForward = function (child) {
            var index;
            index = this.indexOf(child);
            if (index === -1 || index === this.size() - 1) {
                return;
            }
            this.__components__[index] = this.__components__[index + 1];
            return this.__components__[index + 1] = child;
        };
        moveChildBackward = function (child) {
            var index;
            index = this.indexOf(child);
            if (index === -1 || index === 0) {
                return;
            }
            this.__components__[index] = this.__components__[index - 1];
            return this.__components__[index - 1] = child;
        };
        moveChildToFront = function (child) {
            var head, index, tail;
            index = this.indexOf(child);
            if (index === -1 || index === this.size() - 1) {
                return;
            }
            head = this.__components__.splice(0, index);
            tail = this.__components__.splice(1);
            return this.__components__ = head.concat(tail, this.__components__);
        };
        moveChildToBack = function (child) {
            var head, index, tail;
            index = this.indexOf(child);
            if (index === -1 || index === 0) {
                return;
            }
            head = this.__components__.splice(0, index);
            tail = this.__components__.splice(1);
            return this.__components__ = this.__components__.concat(head, tail);
        };
        Container = function (_super) {
            __extends(Container, _super);
            function Container(type) {
                Container.__super__.constructor.call(this, type);
            }
            Container.prototype.dispose = function () {
                var children, component, _i, _len;
                if (this.__components__) {
                    children = dou.util.clone(this.__components__);
                    for (_i = 0, _len = children.length; _i < _len; _i++) {
                        component = children[_i];
                        component.dispose();
                    }
                    this.__components__ = null;
                }
                return Container.__super__.dispose.call(this);
            };
            Container.prototype.add = add;
            Container.prototype.remove = remove;
            Container.prototype.size = size;
            Container.prototype.getAt = getAt;
            Container.prototype.indexOf = indexOf;
            Container.prototype.forEach = forEach;
            Container.prototype.moveChildAt = moveChildAt;
            Container.prototype.moveChildForward = moveChildForward;
            Container.prototype.moveChildBackward = moveChildBackward;
            Container.prototype.moveChildToFront = moveChildToFront;
            Container.prototype.moveChildToBack = moveChildToBack;
            return Container;
        }(Component);
        return Container;
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
            if (selector === '(all)') {
                return true;
            }
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
            EventPump.prototype.clear = function () {
                return this.listeners = [];
            };
            EventPump.prototype.dispose = function () {
                this.stop();
                return this.clear();
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
                this.eventMaps = [];
                this.setRoot(root);
            }
            EventEngine.prototype.setRoot = function (root) {
                return this.root = root;
            };
            EventEngine.prototype.stop = function () {
                var item, _i, _len, _ref, _results;
                _ref = this.eventMaps;
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
                    _results.push(function () {
                        var _i, _len, _results1;
                        _results1 = [];
                        for (_i = 0, _len = targets.length; _i < _len; _i++) {
                            target = targets[_i];
                            eventPump = new EventPump(target);
                            eventPump.on(listener, handlers);
                            eventPump.start(context);
                            _results1.push(this.eventMaps.push({
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
                var index, item, maps, _i, _len, _results;
                maps = dou.util.clone(this.eventMaps);
                _results = [];
                for (index = _i = 0, _len = maps.length; _i < _len; index = ++_i) {
                    item = maps[index];
                    if (item.listener === listener && (!handlerMap || item.handlerMap === handlerMap)) {
                        this.eventMaps.splice(index, 1);
                        _results.push(item.eventPump.dispose());
                    } else {
                        _results.push(void 0);
                    }
                }
                return _results;
            };
            EventEngine.prototype.clear = function () {
                var eventMap, maps, _i, _len;
                maps = dou.util.clone(this.eventMaps);
                for (_i = 0, _len = maps.length; _i < _len; _i++) {
                    eventMap = maps[_i];
                    eventMap.eventPump.dispose();
                }
                return this.eventMaps = [];
            };
            EventEngine.prototype.dispose = function () {
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
    define('build/EventTracker', ['dou'], function (dou) {
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
            StandAloneTracker.prototype.dispose = function () {
                return this.off();
            };
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
            EventTracker.prototype.setSelector = function (selector) {
                return this.selector = selector;
            };
            EventTracker.prototype.on = function (target, handlers, listener, context) {
                var deliverer, deliverers, tracker, _i, _len, _results;
                deliverers = function () {
                    switch (typeof target) {
                    case 'object':
                        return [target];
                    case 'string':
                        return this.selector.select(target, listener);
                    default:
                        return [];
                    }
                }.call(this);
                if (!(deliverers instanceof Array)) {
                    deliverers = [deliverers];
                }
                _results = [];
                for (_i = 0, _len = deliverers.length; _i < _len; _i++) {
                    deliverer = deliverers[_i];
                    tracker = new StandAloneTracker(deliverer, handlers, {
                        listener: listener,
                        deliverer: deliverer,
                        context: context || deliverer
                    });
                    this.trackers.push(tracker);
                    _results.push(tracker.on());
                }
                return _results;
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
            EventTracker.prototype.dispose = function () {
                var tracker, _i, _len, _ref;
                _ref = this.trackers;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    tracker = _ref[_i];
                    tracker.dispose();
                }
                this.trackers = [];
                return this.selector = null;
            };
            EventTracker.StandAlone = StandAloneTracker;
            return EventTracker;
        }();
    });
}.call(this));
(function () {
    var __hasProp = {}.hasOwnProperty;
    define('build/ComponentFactory', [
        'dou',
        './MVCMixin',
        './Component',
        './Container',
        './EventEngine',
        './EventTracker'
    ], function (dou, MVCMixin, Component, Container, EventEngine, EventTracker) {
        'use strict';
        var ComponentFactory;
        ComponentFactory = function () {
            ComponentFactory.prototype.seed = 1;
            function ComponentFactory(componentRegistry, eventEngine, eventTracker) {
                this.componentRegistry = componentRegistry;
                this.eventEngine = eventEngine;
                this.eventTracker = eventTracker;
            }
            ComponentFactory.prototype.dispose = function () {
                this.componentRegistry = null;
                if (this.eventEngine) {
                    return this.eventEngine.dispose();
                }
            };
            ComponentFactory.prototype.uniqueId = function () {
                return 'noid-' + this.seed++;
            };
            ComponentFactory.prototype.createView = function (component, controller) {
                var handlers, selector, spec, type, variable, view, _ref;
                type = component.type;
                spec = this.componentRegistry.get(type);
                if (!spec) {
                    throw new Error('Component Spec Not Found for type \'' + type + '\'');
                }
                view = spec.view_factory_fn.call(controller, component.getAll());
                controller.attach(component, view);
                if (component instanceof Container) {
                    component.forEach(function (child) {
                        return view.add(this.createView(child, controller));
                    }, this);
                }
                if (spec.view_event_map) {
                    _ref = spec.view_event_map;
                    for (selector in _ref) {
                        if (!__hasProp.call(_ref, selector))
                            continue;
                        handlers = _ref[selector];
                        if (selector.indexOf('?') === 0) {
                            variable = selector.substr(1);
                            selector = component.get(variable);
                            if (selector === void 0) {
                                console.log('ComponentFactory#crateView', 'variable ' + selector + ' is not evaluated on listener');
                                continue;
                            }
                        }
                        this.eventTracker.on(selector, handlers, view, controller);
                    }
                }
                return view;
            };
            ComponentFactory.prototype.createComponent = function (obj, controller) {
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
                            component.add(this.createComponent(child, controller));
                        }
                    }
                    if (obj.components) {
                        _ref1 = obj.components;
                        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                            child = _ref1[_j];
                            component.add(this.createComponent(child, controller));
                        }
                    }
                } else {
                    component = new Component(obj.type);
                }
                component.initialize(dou.util.shallow_merge(spec.defaults || {}, obj.attrs || {}));
                if (spec.model_initialize_fn) {
                    spec.model_initialize_fn.call(component);
                }
                if (!component.get('id')) {
                    component.set('id', this.uniqueId());
                }
                if (spec.exportable) {
                    spec.exportable(controller, component);
                }
                if (spec.model_event_map) {
                    this.eventEngine.add(component, spec.model_event_map, controller);
                }
                component.addDisposer(function (_this) {
                    return function () {
                        var view, _k, _len2, _ref2;
                        _this.eventEngine.remove(component);
                        _ref2 = component.getViews();
                        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                            view = _ref2[_k];
                            _this.eventTracker.off(view);
                            view.destroy();
                        }
                        return component.detachAll();
                    };
                }(this));
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
            CommandManager.prototype.dispose = function () {
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
    var __hasProp = {}.hasOwnProperty;
    define('build/ComponentRegistry', ['dou'], function (dou) {
        'use strict';
        var ComponentRegistry;
        return ComponentRegistry = function () {
            function ComponentRegistry() {
                this.componentSpecs = {};
            }
            ComponentRegistry.prototype.dispose = function () {
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
                this.selectable_fn = config.selectable_fn;
            }
            SelectionManager.prototype.dispose = function () {
                return this.reset();
            };
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
                this.selections = function () {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = target.length; _i < _len; _i++) {
                        item = target[_i];
                        if (!this.selectable_fn || this.selectable_fn(item)) {
                            _results.push(item);
                        }
                    }
                    return _results;
                }.call(this);
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
                if (this.onselectionchange && (added.length > 0 || removed.length > 0)) {
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
define("build/Clipboard",["module","require","exports"],function(module, require, exports) {
(function () {
}.call(this));
});
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
    define('build/command/CommandMove', [
        'dou',
        '../Command'
    ], function (dou, Command) {
        'use strict';
        var CommandMove;
        return CommandMove = function (_super) {
            __extends(CommandMove, _super);
            function CommandMove() {
                return CommandMove.__super__.constructor.apply(this, arguments);
            }
            CommandMove.prototype.execute = function () {
                var layer, model, to, view;
                to = this.params.to;
                model = this.params.model;
                view = this.params.view;
                this.i_model = model.getContainer().indexOf(model);
                this.i_view = view.getZIndex();
                switch (to) {
                case 'FORWARD':
                    view.moveUp();
                    model.moveForward();
                    break;
                case 'BACKWARD':
                    view.moveDown();
                    model.moveBackward();
                    break;
                case 'FRONT':
                    view.moveToTop();
                    model.moveToFront();
                    break;
                case 'BACK':
                    view.moveToBottom();
                    model.moveToBack();
                }
                layer = view.getLayer();
                if (layer) {
                    return layer.draw();
                }
            };
            CommandMove.prototype.unexecute = function () {
                var layer, model, to, view;
                to = this.params.to;
                model = this.params.model;
                view = this.params.view;
                view.setZIndex(this.i_view);
                model.moveAt(this.i_model);
                layer = view.getLayer();
                if (layer) {
                    return layer.draw();
                }
            };
            return CommandMove;
        }(Command);
    });
}.call(this));
(function () {
    define('build/spec/SpecContentEditLayerExportable', [
        '../command/CommandPropertyChange',
        '../command/CommandMove'
    ], function (CommandPropertyChange, CommandMove) {
        var copy, cut, moveBackward, moveDelta, moveForward, moveToBack, moveToFront, offset, paste, _move;
        _move = function (appcontext, to) {
            var view;
            view = appcontext.selectionManager.focus();
            if (!view) {
                return;
            }
            return appcontext.execute(new CommandMove({
                to: to,
                view: view,
                model: appcontext.getAttachedModel(view)
            }));
        };
        moveForward = function (appcontext) {
            return _move(appcontext, 'FORWARD');
        };
        moveBackward = function (appcontext) {
            return _move(appcontext, 'BACKWARD');
        };
        moveToFront = function (appcontext) {
            return _move(appcontext, 'FRONT');
        };
        moveToBack = function (appcontext) {
            return _move(appcontext, 'BACK');
        };
        cut = function (appcontext) {
            return appcontext.clipboard.cut(appcontext.selectionManager.get());
        };
        copy = function (appcontext) {
            return appcontext.clipboard.copy(appcontext.selectionManager.get());
        };
        paste = function (appcontext) {
            var component, components, nodes;
            components = appcontext.clipboard.paste();
            nodes = function () {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = components.length; _i < _len; _i++) {
                    component = components[_i];
                    _results.push(appcontext.getAttachedModel(component));
                }
                return _results;
            }();
            return appcontext.selectionManager.select(nodes);
        };
        moveDelta = function (appcontext, component, delta) {
            var after, attr, before, changes, comp, node, nodes, _i, _len;
            nodes = appcontext.selectionManager.get();
            changes = [];
            for (_i = 0, _len = nodes.length; _i < _len; _i++) {
                node = nodes[_i];
                comp = appcontext.getAttachedModel(node);
                before = {};
                after = {};
                for (attr in delta) {
                    before[attr] = comp.get(attr);
                    after[attr] = comp.get(attr) + delta[attr];
                }
                changes.push({
                    component: comp,
                    before: before,
                    after: after
                });
            }
            return appcontext.commandManager.execute(new CommandPropertyChange({ changes: changes }));
        };
        offset = function (appcontext, component, position) {
            var layer;
            layer = component.getViews()[0];
            layer.offset(position);
            layer.fire('change-offset', layer.offset(), false);
            return layer.batchDraw();
        };
        return function (appcontext, component) {
            var exportableFunctions, func, name, _results;
            exportableFunctions = {
                moveDelta: function (delta) {
                    return moveDelta(appcontext, component, delta);
                },
                moveForward: function () {
                    return moveForward(appcontext, component);
                },
                moveBackward: function () {
                    return moveBackward(appcontext, component);
                },
                moveToFront: function () {
                    return moveToFront(appcontext, component);
                },
                moveToBack: function () {
                    return moveToBack(appcontext, component);
                },
                offset: function (position) {
                    return offset(appcontext, component, position);
                },
                cut: function () {
                    return cut(appcontext, component);
                },
                copy: function () {
                    return copy(appcontext, component);
                },
                paste: function () {
                    return paste(appcontext, component);
                }
            };
            _results = [];
            for (name in exportableFunctions) {
                func = exportableFunctions[name];
                _results.push(appcontext[name] = func);
            }
            return _results;
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecContentEditLayer', [
        'dou',
        'KineticJS',
        '../command/CommandPropertyChange',
        './SpecContentEditLayerExportable'
    ], function (dou, kin, CommandPropertyChange, exportable) {
        'use strict';
        var model_event_map, model_initialize, onadded, onchange, onchangemodel, onchangeoffset, onchangeselections, onclick, ondragend, ondragmove, ondragstart, onremoved, onresize, view_event_map, view_factory, _mousePointOnEvent, _stuckBackgroundPosition;
        view_factory = function (attributes) {
            var background, layer, offset, stage;
            stage = this.getView().getStage();
            offset = attributes.offset || {
                x: 0,
                y: 0
            };
            layer = new kin.Layer(attributes);
            background = new kin.Rect({
                name: 'background for ruler-layer',
                draggable: true,
                listening: true,
                x: 0,
                y: 0,
                width: Math.min(stage.width() + offset.x, stage.width()),
                height: Math.min(stage.height() + offset.y, stage.height()),
                stroke: attributes.stroke,
                fill: 'cyan',
                opacity: 0.1
            });
            layer.getBackground = function () {
                return background;
            };
            layer.getOriginOffset = function () {
                return offset;
            };
            layer.add(background);
            return layer;
        };
        model_initialize = function () {
        };
        onadded = function (container, component, index, e) {
        };
        onremoved = function (container, component, e) {
        };
        onchangemodel = function (after, before, e) {
            var model;
            model = e.listener;
            if (before) {
                model.remove(before);
                before.dispose();
            }
            if (after) {
                return model.add(after);
            }
        };
        onchangeselections = function (after, before, added, removed) {
            var controller;
            controller = this;
            if (after.length > 0) {
                return console.log('selection-changed', after[0], controller.getAttachedModel(after[0]));
            }
        };
        onchange = function (component, before, after) {
            var node;
            node = component.getViews()[0];
            node.setAttrs(after);
            return node.getLayer().batchDraw();
        };
        _stuckBackgroundPosition = function (layer) {
            var layerOffset, layerOriginOffset;
            layerOffset = layer.offset();
            layerOriginOffset = layer.getOriginOffset();
            return layer.getBackground().position({
                x: layerOffset.x - layerOriginOffset.x,
                y: layerOffset.y - layerOriginOffset.y
            });
        };
        _mousePointOnEvent = function (layer, e) {
            var scale;
            scale = layer.getStage().scale();
            return {
                x: Math.round(e.offsetX / scale.x),
                y: Math.round(e.offsetY / scale.y)
            };
        };
        ondragstart = function (e) {
            var background, controller, layer, model, node, offset;
            controller = this.context;
            layer = this.listener;
            model = controller.getAttachedModel(layer);
            background = layer.getBackground();
            node = e.targetNode;
            controller.selectionManager.select(node);
            if (node && node !== background) {
                return;
            }
            this.layerOffsetOnStart = layer.offset();
            this.mousePointOnStart = _mousePointOnEvent(layer, e);
            offset = {
                x: this.mousePointOnStart.x + this.layerOffsetOnStart.x,
                y: this.mousePointOnStart.y + this.layerOffsetOnStart.y
            };
            this.selectbox = new kin.Rect({
                stroke: 'black',
                strokeWidth: 1,
                dash: [
                    3,
                    3
                ]
            });
            layer.add(this.selectbox);
            this.selectbox.setAttrs(offset);
            _stuckBackgroundPosition(layer);
            layer.draw();
            return e.cancelBubble = true;
        };
        ondragmove = function (e) {
            var background, controller, layer, model, mousePointCurrent, moveDelta, node;
            controller = this.context;
            layer = this.listener;
            model = controller.getAttachedModel(layer);
            background = layer.getBackground();
            node = e.targetNode;
            if (node && node !== background) {
                return;
            }
            mousePointCurrent = _mousePointOnEvent(layer, e);
            moveDelta = {
                x: mousePointCurrent.x - this.mousePointOnStart.x,
                y: mousePointCurrent.y - this.mousePointOnStart.y
            };
            this.selectbox.setAttrs({
                width: moveDelta.x,
                height: moveDelta.y
            });
            _stuckBackgroundPosition(layer);
            layer.batchDraw();
            return e.cancelBubble = true;
        };
        ondragend = function (e) {
            var background, cmd, controller, dragmodel, dragview, layer, model;
            controller = this.context;
            layer = this.listener;
            model = controller.getAttachedModel(layer);
            dragview = e.targetNode;
            dragmodel = controller.getAttachedModel(dragview);
            if (dragmodel) {
                cmd = new CommandPropertyChange({
                    changes: [{
                            component: dragmodel,
                            before: {
                                x: dragmodel.get('x'),
                                y: dragmodel.get('y')
                            },
                            after: {
                                x: dragview.x(),
                                y: dragview.y()
                            }
                        }]
                });
                controller.execute(cmd);
            }
            layer = this.listener;
            background = layer.getBackground();
            if (e.targetNode && e.targetNode !== background) {
                return;
            }
            this.selectbox.remove();
            delete this.selectbox;
            _stuckBackgroundPosition(layer);
            layer.draw();
            return e.cancelBubble = true;
        };
        onclick = function (e) {
            var node;
            node = e.targetNode;
            return this.context.selectionManager.select(node);
        };
        onresize = function (e) {
            var background, layer;
            layer = this.listener;
            background = layer.getBackground();
            background.setSize(e.after);
            return layer.batchDraw();
        };
        onchangeoffset = function (e) {
            var layer;
            layer = this.listener;
            return _stuckBackgroundPosition(layer);
        };
        model_event_map = {
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
        view_event_map = {
            '(self)': {
                dragstart: ondragstart,
                dragmove: ondragmove,
                dragend: ondragend,
                click: onclick,
                'change-offset': onchangeoffset
            },
            '(root)': { resize: onresize }
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
            model_event_map: model_event_map,
            view_event_map: view_event_map,
            model_initialize_fn: model_initialize,
            view_factory_fn: view_factory,
            toolbox_image: 'images/toolbox_content_edit_layer.png',
            exportable: exportable
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecGuideLayer', ['KineticJS'], function (kin) {
        'use strict';
        var model_event_map, onadded, onchange, ondragend, ondragmove, ondragstart, onremoved, view_event_map, view_factory, _nodeTracker;
        view_factory = function (attributes) {
            return new kin.Layer(attributes);
        };
        onchange = function (component, before, after, e) {
            var controller, model, msg, self, view;
            controller = this;
            model = e.listener;
            view = controller.getAttachedViews(model)[0];
            self = model._track = model._track || {};
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
                view.add(self.text);
            }
            msg = '[ PropertyChange ] ' + component.type + ' : ' + component.get('id') + '\n[ Before ] ' + JSON.stringify(before) + '\n[ After ] ' + JSON.stringify(after);
            self.text.setAttr('text', msg);
            view.draw();
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
                    return view.draw();
                }, 1000);
            }, 5000);
        };
        _nodeTracker = function (guideLayer, node) {
            var guideLayerOffset, nodeAbsPosition, nodeLayerOffset, scale;
            guideLayerOffset = guideLayer.offset();
            nodeLayerOffset = node.getLayer().offset();
            nodeAbsPosition = node.getAbsolutePosition();
            scale = node.getStage().scale();
            return {
                x: nodeAbsPosition.x / scale.x + guideLayerOffset.x,
                y: nodeAbsPosition.y / scale.y + guideLayerOffset.y
            };
        };
        ondragstart = function (e) {
            var guidePosition, layer, node, stage;
            layer = this.listener;
            node = e.targetNode;
            stage = layer.getStage();
            this.scale = stage.getScale();
            this.width = stage.getWidth();
            this.height = stage.getHeight();
            guidePosition = _nodeTracker(layer, node);
            this.vert = new kin.Line({
                stroke: 'red',
                tension: 1,
                points: [
                    guidePosition.x,
                    0,
                    guidePosition.x,
                    this.height
                ]
            });
            this.hori = new kin.Line({
                stroke: 'red',
                tension: 1,
                points: [
                    0,
                    guidePosition.y,
                    this.width,
                    guidePosition.y
                ]
            });
            this.text = new kin.Text({
                listening: false,
                fontSize: 12,
                fontFamily: 'Calibri',
                fill: 'green'
            });
            this.text.setAttrs({
                text: '[ ' + guidePosition.x + '(' + node.x() + '), ' + guidePosition.y + '(' + node.y() + ') ]',
                x: Math.max(guidePosition.x, 0) > this.text.width() + 10 ? guidePosition.x - (this.text.width() + 10) : Math.max(guidePosition.x + 10, 10),
                y: Math.max(guidePosition.y, 0) > this.text.height() + 10 ? guidePosition.y - (this.text.height() + 10) : Math.max(guidePosition.y + 10, 10)
            });
            layer.add(this.vert);
            layer.add(this.hori);
            layer.add(this.text);
            return layer.batchDraw();
        };
        ondragmove = function (e) {
            var autoMovingBottom, autoMovingLeft, autoMovingRight, autoMovingTop, controller, guidePosition, layer, node, nodeLayer, nodePositionCurrent, oldOffset, scale, x, y;
            controller = this.context;
            layer = this.listener;
            node = e.targetNode;
            nodePositionCurrent = node.position();
            node.position({
                x: Math.round(nodePositionCurrent.x / 10) * 10,
                y: Math.round(nodePositionCurrent.y / 10) * 10
            });
            guidePosition = _nodeTracker(layer, node);
            this.vert.setAttrs({
                points: [
                    guidePosition.x,
                    0,
                    guidePosition.x,
                    this.height
                ]
            });
            this.hori.setAttrs({
                points: [
                    0,
                    guidePosition.y,
                    this.width,
                    guidePosition.y
                ]
            });
            this.text.setAttrs({
                text: '[ ' + guidePosition.x + '(' + node.x() + '), ' + guidePosition.y + '(' + node.y() + ') ]',
                x: Math.max(guidePosition.x, 0) > this.text.width() + 10 ? guidePosition.x - (this.text.width() + 10) : Math.max(guidePosition.x + 10, 10),
                y: Math.max(guidePosition.y, 0) > this.text.height() + 10 ? guidePosition.y - (this.text.height() + 10) : Math.max(guidePosition.y + 10, 10)
            });
            scale = node.getStage().scale();
            autoMovingLeft = (node.getStage().width() + layer.offset().x) / scale.x * 1 / 5;
            autoMovingRight = (node.getStage().width() + layer.offset().x) / scale.x * 4 / 5;
            autoMovingTop = (node.getStage().height() + layer.offset().y) / scale.y * 1 / 5;
            autoMovingBottom = (node.getStage().height() + layer.offset().y) / scale.y * 4 / 5;
            console.log(autoMovingLeft, autoMovingRight, autoMovingTop, autoMovingBottom);
            if (guidePosition.x < autoMovingLeft || guidePosition.x > autoMovingRight || guidePosition.y < autoMovingTop || guidePosition.y > autoMovingBottom) {
                nodeLayer = node.getLayer();
                oldOffset = nodeLayer.offset();
                x = guidePosition.x <= autoMovingLeft ? Math.max(oldOffset.x - 10, -20) : guidePosition.x >= autoMovingRight ? oldOffset.x + 10 : oldOffset.x;
                y = guidePosition.y <= autoMovingTop ? Math.max(oldOffset.y - 10, -20) : guidePosition.y >= autoMovingBottom ? oldOffset.y + 10 : oldOffset.y;
                console.log(guidePosition, x, y);
                if (oldOffset.x !== x || oldOffset.y !== y) {
                    controller.offset({
                        x: x,
                        y: y
                    });
                }
            }
            return layer.batchDraw();
        };
        ondragend = function (e) {
            var layer;
            layer = this.listener;
            this.vert.remove();
            this.hori.remove();
            this.text.remove();
            return layer.batchDraw();
        };
        onadded = function (container, component, index, e) {
        };
        onremoved = function (container, component, e) {
        };
        model_event_map = {
            '(root)': { '(all)': { 'change': onchange } },
            '(self)': {
                '(self)': {
                    'added': onadded,
                    'removed': onremoved
                }
            }
        };
        view_event_map = {
            '(root)': {
                dragstart: ondragstart,
                dragmove: ondragmove,
                dragend: ondragend
            }
        };
        return {
            type: 'guide-layer',
            name: 'guide-layer',
            containable: true,
            container_type: 'layer',
            description: 'Editing Guide Specification',
            defaults: { draggable: false },
            model_event_map: model_event_map,
            view_event_map: view_event_map,
            view_factory_fn: view_factory,
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
        var createView, model_event_map, onadded, onchangeoffset, onresize, view_event_map;
        createView = function (attributes) {
            return new kin.Layer(attributes);
        };
        onchangeoffset = function (e) {
            var children, view;
            view = this.listener;
            if (!view.__hori__) {
                children = view.getChildren().toArray();
                view.__hori__ = children[0];
                view.__vert__ = children[1];
            }
            view.__hori__.setAttr('zeropos', -e.x);
            view.__vert__.setAttr('zeropos', -e.y);
            return view.batchDraw();
        };
        onresize = function (e) {
            var children, view;
            view = this.listener;
            if (!view.__hori__) {
                children = view.getChildren().toArray();
                view.__hori__ = children[0];
                view.__vert__ = children[1];
            }
            view.__hori__.setSize({
                width: e.after.width,
                height: 20
            });
            view.__vert__.setSize({
                width: 20,
                height: e.after.height
            });
            return view.batchDraw();
        };
        onadded = function (container, component, index, e) {
            var children, controller, model, stage, view;
            controller = this;
            model = e.listener;
            view = controller.getAttachedViews(model)[0];
            stage = view.getStage();
            if (!view.__hori__) {
                children = view.getChildren().toArray();
                view.__hori__ = children[0];
                view.__vert__ = children[1];
            }
            view.__hori__.setSize({
                width: stage.width(),
                height: 20
            });
            view.__vert__.setSize({
                width: 20,
                height: stage.height()
            });
            return view.batchDraw();
        };
        model_event_map = { '(root)': { '(self)': { added: onadded } } };
        view_event_map = {
            '?offset_monitor_target': { 'change-offset': onchangeoffset },
            '(root)': { 'resize': onresize }
        };
        return {
            type: 'ruler-layer',
            name: 'ruler-layer',
            containable: true,
            container_type: 'layer',
            description: 'Ruler Layer Specification',
            defaults: { draggable: false },
            model_event_map: model_event_map,
            view_event_map: view_event_map,
            view_factory_fn: createView,
            components: [
                {
                    type: 'ruler',
                    attrs: {
                        direction: 'horizontal',
                        name: 'horizontal ruler for ruler-layer',
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
                        name: 'vertical ruler for ruler-layer',
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
        var createView, model_event_map, onchangeoffset, onchangeselection, ondragend, ondragmove, view_event_map;
        createView = function (attributes) {
            var view;
            view = new kin.Layer(attributes);
            view.handles = {};
            return view;
        };
        onchangeoffset = function (e) {
            var view;
            view = this.listener;
            view.offset({
                x: e.x,
                y: e.y
            });
            return view.batchDraw();
        };
        ondragmove = function (e) {
            var handle, id, view;
            view = this.listener;
            id = e.targetNode.getAttr('id');
            handle = view.handles[id];
            if (handle) {
                handle.setAbsolutePosition(e.targetNode.getAbsolutePosition());
                return view.batchDraw();
            }
        };
        ondragend = function (e) {
            var handle, id, view;
            view = this.listener;
            id = e.targetNode.getAttr('id');
            handle = view.handles[id];
            if (handle) {
                handle.setAbsolutePosition(e.targetNode.getAbsolutePosition());
                return view.draw();
            }
        };
        onchangeselection = function (after, before, added, removed, e) {
            var controller, handle, handle_comp, handle_view, id, model, node, pos, view, _i, _j, _len, _len1;
            controller = this;
            model = e.listener;
            view = controller.getAttachedViews(model)[0];
            for (_i = 0, _len = removed.length; _i < _len; _i++) {
                node = removed[_i];
                id = node.getAttr('id');
                handle = view.handles[id];
                handle_comp = controller.getAttachedModel(handle);
                model.remove(handle_comp);
                delete view.handles[id];
            }
            for (_j = 0, _len1 = added.length; _j < _len1; _j++) {
                node = added[_j];
                id = node.getAttr('id');
                pos = node.getAbsolutePosition();
                handle_comp = this.createComponent({
                    type: 'handle-checker',
                    attrs: {}
                });
                model.add(handle_comp);
                handle_view = controller.getAttachedViews(handle_comp)[0];
                handle_view.setAbsolutePosition(pos);
                view.handles[id] = handle_view;
            }
            return view.batchDraw();
        };
        model_event_map = { '(root)': { '(root)': { 'change-selections': onchangeselection } } };
        view_event_map = {
            '?offset_monitor_target': {
                'change-offset': onchangeoffset,
                dragmove: ondragmove,
                dragend: ondragend
            }
        };
        return {
            type: 'handle-layer',
            name: 'handle-layer',
            containable: true,
            container_type: 'layer',
            description: 'Handle Layer Specification',
            defaults: { draggable: false },
            model_event_map: model_event_map,
            view_event_map: view_event_map,
            view_factory_fn: createView,
            toolbox_image: 'images/toolbox_handle_layer.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecMinimapLayer', ['KineticJS'], function (kin) {
        'use strict';
        var model_event_map, onchange, ondragend, ondragmove, ondragstart, onresize, view_event_map, view_factory, _mousePointOnEvent;
        view_factory = function (attributes) {
            var background, controller, layer, stage, targetLayer, zeroOffset;
            stage = this.getView().getStage();
            layer = new kin.Layer(attributes);
            controller = this;
            targetLayer = null;
            zeroOffset = {
                x: 0,
                y: 0
            };
            background = new kin.Rect({
                name: 'background for minimap-layer',
                draggable: true,
                listening: true,
                x: 0,
                y: 0,
                width: stage.width(),
                height: stage.height(),
                stroke: attributes.stroke,
                fill: 'white',
                opacity: 0.5,
                dragBoundFunc: function () {
                    return zeroOffset;
                }
            });
            layer.getTargetLayer = function () {
                var targetComponent;
                if (targetLayer) {
                    return targetLayer;
                }
                targetComponent = controller.findComponent(attributes['target_layer'])[0];
                if (!targetComponent) {
                    return null;
                }
                targetLayer = controller.getAttachedViews(targetComponent)[0];
                if (targetLayer) {
                    targetComponent.addDisposer(function () {
                        return targetLayer = null;
                    });
                }
                return targetLayer;
            };
            layer.getBackground = function () {
                return background;
            };
            layer.add(background);
            return layer;
        };
        _mousePointOnEvent = function (layer, e) {
            var scale;
            scale = layer.getStage().scale();
            return {
                x: Math.round(e.offsetX / scale.x),
                y: Math.round(e.offsetY / scale.y)
            };
        };
        onresize = function (e) {
            var background, layer;
            layer = this.listener;
            background = layer.getBackground();
            background.setSize(e.after);
            return layer.batchDraw();
        };
        ondragstart = function (e) {
            var layer, targetLayer;
            layer = this.listener;
            targetLayer = layer.getTargetLayer();
            if (!targetLayer) {
                return;
            }
            this.targetLayerOffsetOnStart = targetLayer.offset();
            this.mousePointOnStart = _mousePointOnEvent(layer, e);
            return e.cancelBubble = true;
        };
        ondragmove = function (e) {
            var controller, layer, mousePointCurrent, moveDelta, targetLayer;
            controller = this.context;
            layer = this.listener;
            targetLayer = layer.getTargetLayer();
            if (!targetLayer) {
                return;
            }
            mousePointCurrent = _mousePointOnEvent(layer, e);
            moveDelta = {
                x: mousePointCurrent.x - this.mousePointOnStart.x,
                y: mousePointCurrent.y - this.mousePointOnStart.y
            };
            controller.offset({
                x: this.targetLayerOffsetOnStart.x - moveDelta.x,
                y: this.targetLayerOffsetOnStart.y - moveDelta.y
            });
            layer.batchDraw();
            return e.cancelBubble = true;
        };
        ondragend = function (e) {
            var layer;
            layer = this.listener;
            layer.offset({
                x: 0,
                y: 0
            });
            layer.batchDraw();
            return e.cancelBubble = true;
        };
        onchange = function (component, before, after) {
            var node;
            node = component.getViews()[0];
            node.setAttrs(after);
            return node.getLayer().batchDraw();
        };
        model_event_map = { '(self)': { '(self)': { change: onchange } } };
        view_event_map = {
            '(self)': {
                dragstart: ondragstart,
                dragmove: ondragmove,
                dragend: ondragend
            },
            '(root)': { resize: onresize }
        };
        return {
            type: 'minimap-layer',
            name: 'minimap-layer',
            containable: true,
            container_type: 'layer',
            description: 'Minimap Layer Specification',
            defaults: {
                visible: false,
                listening: true
            },
            model_event_map: model_event_map,
            view_event_map: view_event_map,
            view_factory_fn: view_factory,
            toolbox_image: 'images/toolbox_minimap_layer.png',
            exportable: function (appcontext, layer) {
                appcontext.showMinimap = function () {
                    return layer.set('visible', true);
                };
                return appcontext.hideMinimap = function () {
                    return layer.set('visible', false);
                };
            }
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
    define('build/spec/SpecCircle', ['KineticJS'], function (kin) {
        'use strict';
        var createHandle, createView;
        createView = function (attributes) {
            return new kin.Circle(attributes);
        };
        createHandle = function (attributes) {
            return new Kin.Circle(attributes);
        };
        return {
            type: 'circle',
            name: 'circle',
            description: 'Circle Specification',
            defaults: {
                width: 100,
                height: 100,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 4
            },
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_circle.png'
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
    define('build/spec/SpecImage', ['KineticJS'], function (kin) {
        'use strict';
        var createHandle, createView, model_event_map, view_event_map;
        createView = function (attributes) {
            var image, imageObj;
            image = new kin.Image(attributes);
            imageObj = new Image();
            imageObj.onload = function () {
                var layer;
                layer = image.getLayer();
                if (layer) {
                    return layer.draw();
                }
            };
            imageObj.src = attributes['url'];
            image.setImage(imageObj);
            return image;
        };
        createHandle = function (attributes) {
            return new Kin.Image(attributes);
        };
        model_event_map = {
            '(self)': {
                '(self)': {
                    change: function (component, before, after) {
                        var controller, imageObj, view;
                        if (!(before['url'] || after['url'])) {
                            return;
                        }
                        controller = this;
                        view = controller.getAttachedViews(component)[0];
                        imageObj = view.getImage();
                        return imageObj.src = after['url'];
                    }
                }
            }
        };
        view_event_map = {
            '(self)': {
                click: function (e) {
                    var controller, model, view;
                    controller = this.context;
                    view = this.listener;
                    model = controller.getAttachedModel(view);
                    this.count = this.count ? ++this.count : 1;
                    if (this.count % 2) {
                        return model.set('url', 'http://www.baidu.com/img/bdlogo.gif');
                    } else {
                        return model.set('url', 'http://i.cdn.turner.com/cnn/.e/img/3.0/global/header/intl/CNNi_Logo.png');
                    }
                }
            }
        };
        return {
            type: 'image',
            name: 'image',
            description: 'Image Specification',
            defaults: {
                width: 100,
                height: 50,
                stroke: 'black',
                strokeWidth: 1,
                rotationDeg: 0,
                draggable: true
            },
            model_event_map: model_event_map,
            view_event_map: view_event_map,
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_image.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecText', ['KineticJS'], function (kin) {
        'use strict';
        var createHandle, createView;
        createView = function (attributes) {
            return new kin.Text(attributes);
        };
        createHandle = function (attributes) {
            return new Kin.Text(attributes);
        };
        return {
            type: 'text',
            name: 'text',
            description: 'Text Specification',
            defaults: {
                width: 'auto',
                height: 'auto',
                draggable: true,
                strokeWidth: 1,
                fontSize: 40,
                fontFamily: 'Arial',
                fontStyle: 'normal',
                fill: 'black',
                stroke: 'black',
                text: 'TEXT',
                rotationDeg: 0
            },
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_text.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecStar', ['KineticJS'], function (kin) {
        'use strict';
        var createHandle, createView;
        createView = function (attributes) {
            return new kin.Star(attributes);
        };
        createHandle = function (attributes) {
            return new Kin.Star(attributes);
        };
        return {
            type: 'star',
            name: 'star',
            description: 'Star Specification',
            defaults: {
                width: 100,
                height: 50,
                numPoints: 5,
                innerRadius: 35,
                outerRadius: 70,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 4
            },
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_star.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecBarcode', [
        'bwip',
        'KineticJS'
    ], function (bwip, kin) {
        'use strict';
        var createHandle, createView, model_event_map;
        createView = function (attributes) {
            var imageObj, view;
            view = new kin.Image({
                x: attributes.x,
                y: attributes.y,
                draggable: true,
                id: attributes.id
            });
            imageObj = new Image();
            imageObj.onload = function () {
                var layer;
                view.setAttrs({
                    width: imageObj.width,
                    height: imageObj.height
                });
                layer = view.getLayer();
                if (layer) {
                    return layer.draw();
                }
            };
            imageObj.src = bwip.imageUrl({
                symbol: attributes['symbol'],
                text: attributes['text'],
                alttext: attributes['alttext'],
                scale_h: attributes['scale_h'],
                scale_w: attributes['scale_w'],
                rotation: attributes['rotation']
            });
            view.setImage(imageObj);
            return view;
        };
        createHandle = function (attributes) {
            return new Kin.Image(attributes);
        };
        model_event_map = {
            '(self)': {
                '(self)': {
                    change: function (component, before, after, changed) {
                        var controller, imageObj, url, view;
                        if (after.x || after.y) {
                            return;
                        }
                        controller = this;
                        view = controller.getAttachedViews()[0];
                        url = bwip.imageUrl({
                            symbol: component.get('symbol'),
                            text: component.get('text'),
                            alttext: component.get('alttext'),
                            scale_h: component.get('scale_h'),
                            scale_w: component.get('scale_w'),
                            rotation: component.get('rotation')
                        });
                        imageObj = view.getImage();
                        return imageObj.src = url;
                    }
                }
            }
        };
        return {
            type: 'barcode',
            name: 'barcode',
            description: 'Barcode Specification',
            defaults: {
                width: 100,
                height: 50,
                stroke: 'black',
                strokeWidth: 1,
                rotationDeg: 0,
                draggable: true
            },
            model_event_map: model_event_map,
            view_factory_fn: createView,
            handle_factory_fn: createHandle,
            toolbox_image: 'images/toolbox_barcode.png'
        };
    });
}.call(this));
(function () {
    define('build/handle/HandleChecker', [
        'dou',
        'KineticJS'
    ], function (dou, kin) {
        'use strict';
        var createHandle, createView;
        createView = function (attributes) {
            var fill, fills;
            fills = [
                'red',
                'black',
                'yellow',
                'cyan'
            ];
            fill = Math.floor(Math.random() * 10) % fills.length;
            return new kin.Rect(dou.util.shallow_merge(attributes, { fill: fills[fill] }));
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
        './SpecMinimapLayer',
        './SpecGroup',
        './SpecRect',
        './SpecCircle',
        './SpecRing',
        './SpecRuler',
        './SpecImage',
        './SpecText',
        './SpecStar',
        './SpecBarcode',
        '../handle/HandleChecker'
    ], function (kin, SpecInfographic, SpecContentEditLayer, SpecGuideLayer, SpecRulerLayer, SpecHandleLayer, SpecMinimapLayer, SpecGroup, SpecRect, SpecCircle, SpecRing, SpecRuler, SpecImage, SpecText, SpecStar, SpecBarcode, HandleChecker) {
        'use strict';
        var createView;
        createView = function (attributes) {
            return new kin.Stage(attributes);
        };
        return {
            type: 'painter-app',
            name: 'painter-app',
            containable: true,
            container_type: 'application',
            description: 'Painter Application Specification',
            defaults: {},
            view_factory_fn: createView,
            dependencies: {
                'infographic': SpecInfographic,
                'content-edit-layer': SpecContentEditLayer,
                'guide-layer': SpecGuideLayer,
                'ruler-layer': SpecRulerLayer,
                'handle-layer': SpecHandleLayer,
                'minimap-layer': SpecMinimapLayer,
                'group': SpecGroup,
                'rect': SpecRect,
                'circle': SpecCircle,
                'ring': SpecRing,
                'ruler': SpecRuler,
                'image': SpecImage,
                'text': SpecText,
                'star': SpecStar,
                'barcode': SpecBarcode,
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
                        'target_layer': 'content-edit-layer',
                        offset: {
                            x: -20,
                            y: -20
                        }
                    }
                },
                {
                    type: 'ruler-layer',
                    attrs: { offset_monitor_target: 'content-edit-layer' }
                },
                {
                    type: 'minimap-layer',
                    attrs: { target_layer: 'content-edit-layer' }
                }
            ],
            toolbox_image: 'images/toolbox_painter_app.png'
        };
    });
}.call(this));
(function () {
    define('build/spec/SpecContentViewLayer', [
        'dou',
        'KineticJS'
    ], function (dou, kin) {
        'use strict';
        var model_event_map, model_initialize, onadded, onchange, onchangemodel, onremoved, view_event_map, view_factory, _mousePointOnEvent;
        view_factory = function (attributes) {
            return new kin.Layer(attributes);
        };
        model_initialize = function () {
        };
        onadded = function (container, component, index, e) {
        };
        onremoved = function (container, component, e) {
        };
        onchangemodel = function (after, before, e) {
            var model;
            model = e.listener;
            if (before) {
                model.remove(before);
                before.dispose();
            }
            if (after) {
                return model.add(after);
            }
        };
        onchange = function (component, before, after) {
            var node;
            node = component.getViews()[0];
            node.setAttrs(after);
            return node.getLayer().batchDraw();
        };
        _mousePointOnEvent = function (layer, e) {
            var scale;
            scale = layer.getStage().scale();
            return {
                x: Math.round(e.offsetX / scale.x),
                y: Math.round(e.offsetY / scale.y)
            };
        };
        model_event_map = {
            '(root)': { '(root)': { 'change-model': onchangemodel } },
            '(self)': {
                '(self)': {
                    'added': onadded,
                    'removed': onremoved
                },
                '(all)': { 'change': onchange }
            }
        };
        return view_event_map = {
            type: 'content-view-layer',
            name: 'content-view-layer',
            containable: true,
            container_type: 'layer',
            description: 'Content View Layer Specification',
            defaults: {},
            model_event_map: model_event_map,
            view_event_map: view_event_map,
            model_initialize_fn: model_initialize,
            view_factory_fn: view_factory,
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
        var createView;
        createView = function (attributes) {
            return new kin.Stage(attributes);
        };
        return {
            type: 'presenter-app',
            name: 'presenter-app',
            containable: true,
            container_type: 'application',
            description: 'Presenter Application Specification',
            defaults: {},
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
        './MVCMixin',
        './Component',
        './Container',
        './EventEngine',
        './EventTracker',
        './ComponentFactory',
        './Command',
        './CommandManager',
        './command/CommandPropertyChange',
        './ComponentRegistry',
        './ComponentSelector',
        './SelectionManager',
        './Clipboard',
        './ComponentSpec',
        './spec/SpecPainter',
        './spec/SpecPresenter',
        './spec/SpecInfographic',
        './command/CommandMove'
    ], function (dou, kin, MVCMixin, Component, Container, EventEngine, EventTracker, ComponentFactory, Command, CommandManager, CommandPropertyChange, ComponentRegistry, ComponentSelector, SelectionManager, Clipboard, ComponentSpec, SpecPainter, SpecPresenter, SpecInfographic, CommandMove) {
        'use strict';
        var ApplicationContext;
        ApplicationContext = function () {
            function ApplicationContext(options) {
                var attributes, component, container, rootComponent, rootView, _i, _len, _ref;
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
                    context: this,
                    selectable_fn: function (item) {
                        return item.getAttr('id');
                    }
                });
                this.compEventTracker = new EventTracker();
                this.viewEventTracker = new EventTracker();
                this.eventEngine = new EventEngine();
                this.componentRegistry = new ComponentRegistry();
                this.componentRegistry.setRegisterCallback(function (spec) {
                }, this);
                this.componentRegistry.setUnregisterCallback(function (spec) {
                }, this);
                this.componentFactory = new ComponentFactory(this.componentRegistry, this.eventEngine, this.viewEventTracker);
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
                rootView = this.view;
                rootComponent = this.application;
                this.compEventTracker.setSelector({
                    select: function (selector, listener) {
                        return CompoentSelector.select(selector, rootComponent, listener);
                    }
                });
                this.viewEventTracker.setSelector({
                    select: function (selector, listener) {
                        var comp, comps, view, views, _i, _j, _len, _len1, _ref;
                        if (selector === '(self)') {
                            return listener;
                        }
                        if (selector === '(root)') {
                            return rootView;
                        }
                        comps = ComponentSelector.select(selector, rootComponent);
                        views = [];
                        for (_i = 0, _len = comps.length; _i < _len; _i++) {
                            comp = comps[_i];
                            _ref = comp.getViews();
                            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                                view = _ref[_j];
                                views.push(view);
                            }
                        }
                        return views;
                    }
                });
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
            ApplicationContext.prototype.dispose = function () {
                this.application.dispose();
                this.compEventTracker.dispose();
                return this.componentFactory.dispose();
            };
            ApplicationContext.prototype.getEventTracker = function () {
                return this.compEventTracker;
            };
            ApplicationContext.prototype.getView = function () {
                return this.view;
            };
            ApplicationContext.prototype.getModel = function () {
                return this.model;
            };
            ApplicationContext.prototype.setModel = function (model) {
                var before;
                if (model === this.model) {
                    return;
                }
                this.commandManager.reset();
                this.selectionManager.reset();
                before = this.model;
                this.model = model;
                return this.application.trigger('change-model', this.model, before);
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
                return this.view.batchDraw();
            };
            ApplicationContext.prototype.execute = function (command) {
                return this.commandManager.execute(command);
            };
            ApplicationContext.prototype.setSize = function (width, height) {
                var before;
                before = this.view.getSize();
                this.view.setSize({
                    width: width,
                    height: height
                });
                return this.view.fire('resize', {
                    before: before,
                    after: {
                        width: width,
                        height: height
                    }
                });
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
                vcomponent = this.findViewByComponent(component);
                vcomponent.destroy();
                return this.drawView();
            };
            ApplicationContext.prototype.onselectionchange = function (changes) {
                return this.application.trigger('change-selections', changes.after, changes.before, changes.added, changes.removed);
            };
            ApplicationContext.prototype.redo = function () {
                return this.commandManager.redo();
            };
            ApplicationContext.prototype.undo = function () {
                return this.commandManager.undo();
            };
            ApplicationContext.prototype.setScale = function (scale) {
                this.getView().scale({
                    x: scale,
                    y: scale
                });
                return this.drawView();
            };
            ApplicationContext.prototype.scaleEnlarge = function () {
                var scale;
                scale = this.getView().scaleX();
                return this.setScale(scale + 1 > 8 ? 8 : scale + 1);
            };
            ApplicationContext.prototype.scaleReduce = function () {
                var scale;
                scale = this.getView().scaleX();
                return this.setScale(scale - 1 < 1 ? 1 : scale - 1);
            };
            return ApplicationContext;
        }();
        dou.mixin(ApplicationContext, MVCMixin.controller);
        return ApplicationContext;
    });
}.call(this));
(function () {
    var __indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item)
                    return i;
            }
            return -1;
        };
    define('build/Module', [], function () {
        var Module, moduleKeywords;
        moduleKeywords = [
            'extended',
            'included'
        ];
        return Module = function () {
            function Module() {
            }
            Module.extend = function (obj) {
                var key, value, _ref;
                for (key in obj) {
                    value = obj[key];
                    if (__indexOf.call(moduleKeywords, key) < 0) {
                        this[key] = value;
                    }
                }
                if ((_ref = obj.extended) != null) {
                    _ref.apply(this);
                }
                return this;
            };
            Module.include = function (obj) {
                var key, value, _ref;
                for (key in obj) {
                    value = obj[key];
                    if (__indexOf.call(moduleKeywords, key) < 0) {
                        this.prototype[key] = value;
                    }
                }
                if ((_ref = obj.included) != null) {
                    _ref.apply(this);
                }
                return this;
            };
            return Module;
        }();
    });
}.call(this));
(function () {
    define('build/infopik', [
        './ApplicationContext',
        './Command',
        './CommandManager',
        './command/CommandPropertyChange',
        './Component',
        './ComponentFactory',
        './ComponentRegistry',
        './ComponentSelector',
        './ComponentSpec',
        './Container',
        './EventEngine',
        './EventPump',
        './EventTracker',
        './Module',
        './MVCMixin',
        './SelectionManager',
        './handle/HandleChecker',
        './spec/SpecBarcode',
        './spec/SpecContentEditLayer',
        './spec/SpecContentViewLayer',
        './spec/SpecGroup',
        './spec/SpecGuideLayer',
        './spec/SpecHandleLayer',
        './spec/SpecImage',
        './spec/SpecInfographic',
        './spec/SpecPainter',
        './spec/SpecPresenter',
        './spec/SpecRect',
        './spec/SpecCircle',
        './spec/SpecRing',
        './spec/SpecRuler',
        './spec/SpecRulerLayer',
        './spec/SpecStar',
        './spec/SpecText'
    ], function (ApplicationContext, Command, CommandManager, CommandPropertyChange, Component, ComponentFactory, ComponentRegistry, ComponentSelector, ComponentSpec, Container, EventEngine, EventPump, EventTracker, Module, MVCMixin, SelectionManager, HandleChecker, SpecBarcode, SpecContentEditLayer, SpecContentViewLayer, SpecGroup, SpecGuideLayer, SpecHandleLayer, SpecImage, SpecInfographic, SpecPainter, SpecPresenter, SpecRect, SpecCircle, SpecRing, SpecRuler, SpecRulerLayer, SpecStar, SpecText) {
        'use strict';
        return {
            app: function (options) {
                return new ApplicationContext(options);
            },
            spec: {
                painter: SpecPainter,
                presenter: SpecPresenter,
                rect: SpecRect,
                circle: SpecCircle,
                ring: SpecRing,
                ruler: SpecRuler,
                star: SpecStar,
                infographic: SpecInfographic,
                barcode: SpecBarcode,
                image: SpecImage,
                group: SpecGroup
            }
        };
    });
}.call(this));

  context.infopik = require('build/infopik');
}(this));