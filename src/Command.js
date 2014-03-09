(function() {
  define(['dou'], function(dou) {
    "use strict";
    var Command;
    Command = (function() {
      function Command(params) {
        this.params = dou.util.clone(params);
      }

      Command.prototype.execute = function() {};

      Command.prototype.unexecute = function() {};

      return Command;

    })();
    return Command;
  });

}).call(this);
