(function() {
  define(['dou'], function(dou) {
    "use strict";
    var Component;
    Component = (function() {
      function Component() {}

      Component.prototype.draw = function(ctx) {};

      return Component;

    })();
    return dou.mixin(Component, [dou["with"].advice, dou["with"].event, dou["with"].property, dou["with"].lifecycle, dou["with"].serialize]);
  });

}).call(this);
