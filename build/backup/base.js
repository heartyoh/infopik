(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty;

  define(['./utils', './registry', './debug'], function(utils, registry, debug) {
    "use strict";
    var checkSerializable, componentId, proxyEventTo, teardownInstance;
    componentId = 0;
    teardownInstance = function(instanceInfo) {
      var args, event, instance, _i, _len, _ref, _results;
      instance = instanceInfo.instance;
      _ref = instanceInfo.events.slice();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        args = [event.type];
        event.element && args.unshift(event.element);
        (typeof event.callback === 'function') && args.push(event.callback);
        _results.push(instance.off.apply(instance, args));
      }
      return _results;
    };
    checkSerializable = function(type, data) {
      var e;
      try {
        return window.postMessage(data, '*');
      } catch (_error) {
        e = _error;
        console.log('unserializable data for event', type, ':', data);
        throw new Error(['The event', type, 'on component', this.toString(), 'was triggered with non-serializable data'].join(' '));
      }
    };
    proxyEventTo = function(targetEvent) {
      return function(e, data) {
        return $(e.target).trigger(targetEvent, data);
      };
    };
    return function() {
      this.trigger = function() {
        var $element, data, defaultFn, event, lastArg, lastIndex, type;
        lastIndex = arguments.length - 1;
        lastArg = arguments[lastIndex];
        if (typeof lastArg !== 'string' && !(lastArg && lastArg.defaultBehavior)) {
          lastIndex--;
          data = lastArg;
        }
        if (lastIndex === 1) {
          $element = $(arguments[0]);
          event = arguments[1];
        } else {
          $element = this.$node;
          event = arguments[0];
        }
        if (event.defaultBehavior) {
          defaultFn = event.defaultBehavior;
          event = $.Event(event.type);
        }
        type = event.type || event;
        if (debug.enabled && window.postMessage) {
          checkSerializable.call(this, type, data);
        }
        if (typeof this.attr.eventData === 'object') {
          data = $.extend(true, {}, this.attr.eventData, data);
        }
        $element.trigger(event || type, data);
        if (defaultFn && !event.isDefaultPrevented()) {
          (this[defaultFn] || defaultFn).call(this);
        }
        return $element;
      };
      this.on = function() {
        var $element, callback, lastIndex, origin, originalCb, type;
        lastIndex = arguments.length - 1;
        origin = arguments[lastIndex];
        if (typeof origin === 'object') {
          originalCb = utils.delegate(this.resolveDelegateRules(origin));
        } else if (typeof origin === 'string') {
          originalCb = proxyEventTo(origin);
        } else {
          originalCb = origin;
        }
        if (lastIndex === 2) {
          $element = $(arguments[0]);
          type = arguments[1];
        } else {
          $element = this.$node;
          type = arguments[0];
        }
        if (typeof originalCb !== 'function' && typeof originalCb !== 'object') {
          throw new Error('Unable to bind to "' + type + '" because the given callback is not a function or an object');
        }
        callback = originalCb.bind(this);
        callback.target = originalCb;
        callback.context = this;
        $element.on(type, callback);
        originalCb.bound || (originalCb.bound = []);
        originalCb.bound.push(callback);
        return callback;
      };
      this.off = function() {
        var $element, callback, lastIndex, type;
        lastIndex = arguments.length - 1;
        if (typeof arguments[lastIndex] === 'function') {
          callback = arguments[lastIndex];
          lastIndex -= 1;
        }
        if (lastIndex === 1) {
          $element = $(arguments[0]);
          type = arguments[1];
        } else {
          $element = this.$node;
          type = arguments[0];
        }
        if (callback) {
          callback.bound && callback.bound.some(function(fn, i, arr) {
            if (fn.context && (this.identity === fn.context.identity)) {
              arr.splice(i, 1);
              callback = fn;
              return true;
            }
          }, this);
        }
        return $element.off(type, callback);
      };
      this.resolveDelegateRules = function(ruleInfo) {
        var rules;
        rules = {};
        Object.keys(ruleInfo).forEach(function(r) {
          if (!(__indexOf.call(this.attr, r) >= 0)) {
            throw new Error('Component "' + this.toString() + '" wants to listen on "' + r + '" but no such attribute was defined.');
          }
          return rules[this.attr[r]] = typeof ruleInfo[r] === 'string' ? proxyEventTo(ruleInfo[r]) : ruleInfo[r];
        }, this);
        return rules;
      };
      this.defaultAttrs = function(defaults) {
        return utils.push(this.defaults, defaults, true) || (this.defaults = defaults);
      };
      this.select = function(attributeKey) {
        return this.$node.find(this.attr[attributeKey]);
      };
      this.initialize = function(node, attrs) {
        var attr, key, val, _ref, _ref1;
        attrs || (attrs = {});
        this.identity || (this.identity = componentId++);
        if (!node) {
          throw new Error('Component needs a node');
          this.node = node;
        }
        attr = Object.create(attrs);
        _ref = this.defaults;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          if (!attrs.hasOwnProperty(key)) {
            attr[key] = this.defaults[key];
          }
        }
        this.attr = attr;
        _ref1 = this.defaults || {};
        for (key in _ref1) {
          if (!__hasProp.call(_ref1, key)) continue;
          val = _ref1[key];
          if (val === null && this.attr[key] === null) {
            throw new Error('Required attribute "' + key + '" not specified in attachTo for component "' + this.toString() + '".');
          }
        }
        return this;
      };
      return this.teardown = function() {
        return teardownInstance(registry.findInstanceInfo(this));
      };
    };
  });

}).call(this);
