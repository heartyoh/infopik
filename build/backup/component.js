(function() {
  define(['./advice', './utils', './compose', './base', './registry', './logger', './debug'], function(advice, utils, compose, withBase, registry, withLogging, debug) {
    "use strict";
    var attachTo, checkSerializable, define, functionNameRegEx, teardownAll;
    functionNameRegEx = /function (.*?)\s?\(/;
    teardownAll = function() {
      var componentInfo, info, k;
      componentInfo = registry.findComponentInfo(this);
      return componentInfo && (function() {
        var _ref, _results;
        _ref = componentInfo.instances;
        _results = [];
        for (k in _ref) {
          info = _ref[k];
          if (info && info.instance) {
            _results.push(info.instance.teardown());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      })();
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
    attachTo = function(selector) {
      var args, componentInfo, i, l, options, _i, _ref;
      l = arguments.length;
      args = new Array(l - 1);
      for (i = _i = 1, _ref = l - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        args[i - 1] = arguments[i];
      }
      if (!selector) {
        throw new Error('Component needs to be attachTo\'d a jQuery object, native node or selector string');
      }
      options = utils.merge.apply(utils, args);
      componentInfo = registry.findComponentInfo(this);
      return $(selector).each((function(i, node) {
        if (componentInfo && componentInfo.isAttachedTo(node)) {
          return;
        }
        return (new this).initialize(node, options);
      }).bind(this));
    };
    define = function() {
      var Component, arg, mixins, _i, _len;
      mixins = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        mixins.push(arg);
      }
      Component = (function() {
        function Component() {}

        Component.prototype.toString = function() {
          return mixins.map(function(mixin) {
            var m;
            if (mixin.name === null) {
              m = mixin.toString().match(functionNameRegEx);
              return (m && m[1] ? m[1] : '');
            } else {
              return (mixin.name !== 'withBase' ? mixin.name : '');
            }
          }).filter(Boolean).join(', ');
        };

        Component.prototype.describe = function() {
          return this.toString();
        };

        return Component;

      })();
      Component.attachTo = attachTo;
      Component.teardownAll = teardownAll;
      if (debug.enabled) {
        mixins.unshift(withLogging);
      }
      mixins.unshift(withBase, advice.withAdvice, registry.withRegistration);
      compose.mixin(Component.prototype, mixins);
      return Component;
    };
    define.teardownAll = function() {
      registry.components.slice().forEach(function(c) {
        return c.component.teardownAll();
      });
      return registry.reset();
    };
    return define;
  });

}).call(this);
