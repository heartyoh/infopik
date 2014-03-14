(function() {
  define(['./utils', './compose', './advice', './base'], function(utils, compose, advice, base) {
    "use strict";
    var actionSymbols, elemToString, log;
    actionSymbols = {
      on: '<-',
      trigger: '->',
      off: 'x '
    };
    elemToString = function(elem) {
      var classStr, result, tagStr;
      tagStr = elem.tagName ? elem.tagName.toLowerCase() : elem.toString();
      classStr = elem.className ? '.' + elem.className : '';
      result = tagStr + classStr;
      if (elem.tagName) {
        return ['\'', '\''].join(result);
      } else {
        return result;
      }
    };
    log = function(action, component, eventArgs) {
      var actionLoggable, elem, eventType, fn, info, logFilter, name, nameLoggable, payload, toRegExp;
      if (!window.DEBUG || !window.DEBUG.enabled) {
        return;
      }
      name = eventType = elem = fn = payload = logFilter = toRegExp = actionLoggable = nameLoggable = info = null;
      if (typeof eventArgs[eventArgs.length - 1] === 'function') {
        fn = eventArgs.pop();
        fn = fn.unbound || fn;
      }
      if (eventArgs.length === 1) {
        elem = component.$node[0];
        eventType = eventArgs[0];
      } else if ((eventArgs.length === 2) && typeof eventArgs[1] === 'object' && !eventArgs[1].type) {
        elem = component.$node[0];
        eventType = eventArgs[0];
        if (action === "trigger") {
          payload = eventArgs[1];
        }
      } else {
        elem = eventArgs[0];
        eventType = eventArgs[1];
        if (action === "trigger") {
          payload = eventArgs[2];
        }
      }
      name = typeof eventType === 'object' ? eventType.type : eventType;
      logFilter = DEBUG.events.logFilter;
      actionLoggable = logFilter.actions === 'all' || (logFilter.actions.indexOf(action) > -1);
      toRegExp = function(expr) {
        if (expr.test) {
          return expr;
        } else {
          return new RegExp('^' + expr.replace(/\*/g, '.*') + '$');
        }
      };
      nameLoggable = logFilter.eventNames === 'all' || logFilter.eventNames.some(function(e) {
        return toRegExp(e).test(name);
      });
      if (actionLoggable && nameLoggable) {
        info = [actionSymbols[action], action, '[' + name + ']'];
        payload && info.push(payload);
        info.push(elemToString(elem));
        info.push(component.constructor.describe.split(' ').slice(0, 3).join(' '));
        return console.info.apply(console, info);
      }
    };
    return function() {
      compose.mixin(this, [advice.withAdvice, base]);
      this.before('trigger', function() {
        return log('trigger', this, utils.toArray(arguments));
      });
      this.before('on', function() {
        return log('on', this, utils.toArray(arguments));
      });
      return this.before('off', function() {
        return log('off', this, utils.toArray(arguments));
      });
    };
  });

}).call(this);
