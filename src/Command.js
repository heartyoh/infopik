(function() {
  define(['dou'], function(dou) {
    "use strict";
    var Command;
    Command = (function() {
      function Command(params) {
        this.params = dou.util.clone(params);
      }

      Command.prototype.excute = function() {};

      Command.prototype.unexcute = function() {};

      return Command;

    })();
    return Command;
  });

}).call(this);
