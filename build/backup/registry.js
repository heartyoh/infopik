(function() {
  var __hasProp = {}.hasOwnProperty;

  define(['./compose', './advice'], function(compose, advice) {
    "use strict";
    var Registry, matchEvent, parseEventArgs;
    parseEventArgs = function(instance, args) {
      var callback, element, end, type;
      end = args.length;
      if (typeof args[end - 1] === 'function') {
        callback = args[--end];
      }
      if (typeof args[end - 1] === 'object') {
        --end;
      }
      if (end === 2) {
        element = args[0];
        type = args[1];
      } else {
        element = instance.node;
        type = args[0];
      }
      return {
        element: element,
        type: type,
        callback: callback
      };
    };
    matchEvent = function(a, b) {
      return (a.element === b.element) && (a.type === b.type) && (!b.callback || a.callback === b.callback);
    };
    Registry = (function() {
      function Registry() {
        var ComponentInfo, InstanceInfo, registry;
        registry = this;
        (this.reset = function() {
          this.components = [];
          this.allInstances = {};
          return this.events = [];
        }).call(this);
        ComponentInfo = (function() {
          function ComponentInfo(component) {
            this.component = component;
            this.attachedTo = [];
            this.instances = {};
            this.addInstance = function(instance) {
              var instanceInfo;
              instanceInfo = new InstanceInfo(instance);
              this.instances[instance.identity] = instanceInfo;
              this.attachedTo.push(instance.node);
              return instanceInfo;
            };
            this.removeInstance = function(instance) {
              var indexOfNode;
              delete this.instances[instance.identity];
              indexOfNode = this.attachedTo.indexOf(instance.node);
              (indexOfNode > -1) && this.attachedTo.splice(indexOfNode, 1);
              if (!Object.keys(this.instances).length) {
                return registry.removeComponentInfo(this);
              }
            };
            this.isAttachedTo = function(node) {
              return this.attachedTo.indexOf(node) > -1;
            };
          }

          return ComponentInfo;

        })();
        InstanceInfo = (function() {
          function InstanceInfo(instance) {
            this.instance = instance;
            this.events = [];
            this.addBind = function(event) {
              this.events.push(event);
              return registry.events.push(event);
            };
            this.removeBind = function(event) {
              var e, i, _i, _len, _ref, _results;
              _ref = this.events;
              _results = [];
              for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                e = _ref[i];
                if (matchEvent(e, event)) {
                  _results.push(this.events.splice(i, 1));
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            };
          }

          return InstanceInfo;

        })();
        this.addInstance = function(instance) {
          var component, inst;
          component = this.findComponentInfo(instance);
          if (!component) {
            component = new ComponentInfo(instance.constructor);
            this.components.push(component);
          }
          inst = component.addInstance(instance);
          this.allInstances[instance.identity] = inst;
          return component;
        };
        this.removeInstance = function(instance) {
          var componentInfo, instInfo;
          instInfo = this.findInstanceInfo(instance);
          componentInfo = this.findComponentInfo(instance);
          componentInfo && componentInfo.removeInstance(instance);
          return delete this.allInstances[instance.identity];
        };
        this.removeComponentInfo = function(componentInfo) {
          var index;
          index = this.components.indexOf(componentInfo);
          return (index > -1) && this.components.splice(index, 1);
        };
        this.findComponentInfo = function(which) {
          var c, component, _i, _len, _ref;
          component = which.attachTo ? which : which.constructor;
          _ref = this.components;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            c = _ref[_i];
            if (c.component === component) {
              return c;
            }
          }
          return null;
        };
        this.findInstanceInfo = function(instance) {
          return this.allInstances[instance.identity] || null;
        };
        this.getBoundEventNames = function(instance) {
          return this.findInstanceInfo(instance).events.map(function(ev) {
            return ev.type;
          });
        };
        this.findInstanceInfoByNode = function(node) {
          var k, result, thisInstanceInfo, _ref;
          result = [];
          _ref = this.allInstances;
          for (k in _ref) {
            if (!__hasProp.call(_ref, k)) continue;
            thisInstanceInfo = _ref[k];
            if (thisInstanceInfo.instance.node === node) {
              result.push(thisInstanceInfo);
            }
          }
          return result;
        };
        this.on = function(componentOn) {
          var boundCallback, event, i, instance, l, otherArgs, _i, _ref;
          instance = registry.findInstanceInfo(this);
          l = arguments.length;
          otherArgs = new Array(l - 1);
          for (i = _i = 1, _ref = l - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
            otherArgs[i - 1] = arguments[i];
          }
          if (instance) {
            boundCallback = componentOn.apply(null, otherArgs);
            if (boundCallback) {
              otherArgs[otherArgs.length - 1] = boundCallback;
            }
            event = parseEventArgs(this, otherArgs);
            return instance.addBind(event);
          }
        };
        this.off = function() {
          var e, event, i, instance, _i, _len, _ref, _results;
          event = parseEventArgs(this, arguments);
          instance = registry.findInstanceInfo(this);
          if (instance) {
            instance.removeBind(event);
          }
          _ref = registry.events;
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            e = _ref[i];
            if (matchEvent(e, event)) {
              _results.push(registry.events.splice(i, 1));
            }
          }
          return _results;
        };
        this.trigger = function() {};
        this.teardown = function() {
          return registry.removeInstance(this);
        };
        this.withRegistration = function() {
          compose.mixin(this, [advice.withAdvice]);
          this.after('initialize', function() {
            return registry.addInstance(this);
          });
          this.around('on', registry.on);
          this.after('off', registry.off);
          window.DEBUG && DEBUG.enabled && this.after('trigger', registry.trigger);
          return this.after('teardown', {
            obj: registry,
            fnName: 'teardown'
          });
        };
      }

      return Registry;

    })();
    return new Registry;
  });

}).call(this);
