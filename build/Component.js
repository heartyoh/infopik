(function() {
  define(['dou'], function(dou) {
    "use strict";
    var Component;
    Component = (function() {
      function Component(type) {
        this.type = type;
        this.__views__ = [];
      }

      Component.prototype.attach = function(view) {
        return this.__views__.push(view);
      };

      Component.prototype.detach = function(view) {
        var index;
        index = this.__views__.indexOf(view);
        if (index > -1) {
          return this.__views__.splice(index, 1);
        }
      };

      Component.prototype.attaches = function() {
        return this.__views__;
      };

      return Component;

    })();
    return dou.mixin(Component, [dou["with"].advice, dou["with"].event, dou["with"].property, dou["with"].lifecycle, dou["with"].serialize]);
  });

}).call(this);
