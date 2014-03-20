(function() {
  define(['dou', './MVCMixin'], function(dou, MVCMixin) {
    "use strict";
    var Component;
    Component = (function() {
      function Component(type) {
        this.type = type;
      }

      return Component;

    })();
    return dou.mixin(Component, [dou["with"].advice, dou["with"].event, dou["with"].property, dou["with"].lifecycle, dou["with"].serialize, MVCMixin.model]);
  });

}).call(this);
