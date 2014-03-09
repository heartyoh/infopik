(function() {
  define(['./ApplicationContext'], function(ApplicationContext) {
    "use strict";
    return {
      app: function(options) {
        return new ApplicationContext(options);
      }
    };
  });

}).call(this);
