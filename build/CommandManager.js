(function() {
  define(['./Command'], function(Command) {
    "use strict";
    var CommandManager;
    CommandManager = (function() {
      function CommandManager(params) {
        this.reset();
      }

      CommandManager.prototype.despose = function() {
        return this.reset();
      };

      CommandManager.prototype.execute = function(command) {
        if (!command instanceof Command) {
          return;
        }
        command.execute();
        this.exq.push(command);
        return this.uxq = [];
      };

      CommandManager.prototype.undo = function() {
        var command;
        command = this.exq.pop();
        if (command) {
          command.unexecute();
          return this.uxq.push(command);
        }
      };

      CommandManager.prototype.redo = function() {
        var command;
        command = this.uxq.pop();
        if (command) {
          command.execute();
          return this.exq.push(command);
        }
      };

      CommandManager.prototype.undoable = function() {
        return this.exq.length > 0;
      };

      CommandManager.prototype.redoable = function() {
        return this.uxq.length > 0;
      };

      CommandManager.prototype.reset = function() {
        this.exq = [];
        return this.uxq = [];
      };

      return CommandManager;

    })();
    return CommandManager;
  });

}).call(this);
