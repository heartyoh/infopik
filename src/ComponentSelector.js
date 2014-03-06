(function() {
  define(['dou', './Component'], function(dou, Component) {
    "use strict";
    var select;
    select = function(selector, component) {
      return selector === component.type;
    };
    return {
      select: select
    };
  });

}).call(this);
