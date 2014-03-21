(function() {
  define(['./ApplicationContext', './spec/SpecPainter'], function(ApplicationContext, SpecPainter) {
    "use strict";
    return {
      app: function(options) {
        return new ApplicationContext(options);
      },
      spec: {
        painter: SpecPainter
      }
    };
  });

}).call(this);
