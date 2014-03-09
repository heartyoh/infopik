(function() {
  define(['dou'], function(dou) {
    "use strict";
    var SelectionManager;
    return SelectionManager = (function() {
      function SelectionManager(config) {
        this.onselectionchange = config.onselectionchange;
        this.selections = [];
      }

      SelectionManager.prototype.get = function() {
        return dou.util.clone(this.selections);
      };

      SelectionManager.prototype.toggle = function(target) {
        var added, old_sels, removed;
        old_sels = dou.util.clone(this.selections);
        added = [];
        removed = [];
        if (this.selections.indexOf(target) >= 0) {
          removed.push(target);
          this.selections = _.without(this.selections, target);
        } else {
          added.push(target);
          this.selections.push(target);
        }
        if (this.onselectionchange) {
          return this.onselectionchange({
            added: added,
            removed: removed,
            selected: this.selections,
            before: old_sels
          });
        }
      };

      SelectionManager.prototype.select = function(target) {
        var added, old_sels, removed;
        old_sels = _.clone(this.selections);
        if (!target instanceof Array) {
          target = !target ? [] : [target];
        }
        this.selections = target;
        added = _.difference(this.selections, old_sels);
        removed = _.difference(old_sels, this.selections);
        if (this.onselectionchange) {
          return this.onselectionchange({
            added: added,
            removed: removed,
            selected: this.selections,
            before: old_sels
          });
        }
      };

      SelectionManager.prototype.reset = function() {
        return this.selections = [];
      };

      return SelectionManager;

    })();
  });

}).call(this);
