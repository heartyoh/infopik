(function() {
  define(['dou', './Component', './Container'], function(dou, Component, Container) {
    "use strict";
    var match, match_by_id, match_by_name, match_by_type, select, select_recurse;
    match_by_id = function(selector, component) {
      return (selector.substr(1)) === component.get('id');
    };
    match_by_name = function(selector, component) {
      return (selector.substr(1)) === component.get('name');
    };
    match_by_type = function(selector, component) {
      return (selector === 'all') || (selector === component.type);
    };
    match = function(selector, component) {
      switch (selector.charAt(0)) {
        case '#':
          return match_by_id(selector, component);
        case '.':
          return match_by_name(selector, component);
        default:
          return match_by_type(selector, component);
      }
    };
    select_recurse = function(matcher, selector, component, result) {
      if (matcher(selector, component)) {
        result.push(component);
      }
      if (component instanceof Container) {
        component.forEach(function(child) {
          return select_recurse(matcher, selector, child, result);
        });
      }
      return result;
    };
    select = function(selector, component) {
      var matcher;
      matcher = (function() {
        switch (selector.charAt(0)) {
          case '#':
            return match_by_id;
          case '.':
            return match_by_name;
          default:
            return match_by_type;
        }
      })();
      return select_recurse(matcher, selector, component, []);
    };
    return {
      select: select,
      match: match
    };
  });

}).call(this);
