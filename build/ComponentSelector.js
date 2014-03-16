(function() {
  define(['dou', './Component', './Container'], function(dou, Component, Container) {
    "use strict";
    var match, match_by_id, match_by_name, match_by_special, match_by_type, select, select_recurse;
    match_by_id = function(selector, component, listener, root) {
      return (selector.substr(1)) === component.get('id');
    };
    match_by_name = function(selector, component, listener, root) {
      return (selector.substr(1)) === component.get('name');
    };
    match_by_special = function(selector, component, listener, root) {
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
    match_by_type = function(selector, component, listener, root) {
      return (selector === 'all') || (selector === component.type);
    };
    match = function(selector, component, listener, root) {
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
    select_recurse = function(matcher, selector, component, listener, root, result) {
      if (matcher(selector, component, listener, root)) {
        result.push(component);
      }
      if (component instanceof Container) {
        component.forEach(function(child) {
          return select_recurse(matcher, selector, child, listener, root, result);
        });
      }
      return result;
    };
    select = function(selector, component, listener, root) {
      var matcher;
      matcher = (function() {
        switch (selector.charAt(0)) {
          case '#':
            return match_by_id;
          case '.':
            return match_by_name;
          case '?':
            return match_by_variable;
          default:
            return match_by_type;
        }
      })();
      return select_recurse(matcher, selector, component, listener, root, []);
    };
    return {
      select: select,
      match: match
    };
  });

}).call(this);
