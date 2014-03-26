(function() {
  define(['dou'], function(dou) {
    "use strict";
    var SelectionManager;
    return SelectionManager = (function() {
      function SelectionManager(config) {
        this.onselectionchange = config.onselectionchange;
        this.context = config.context;
        this.selections = [];
        this.selectable_fn = config.selectable_fn;
      }

      SelectionManager.prototype.dispose = function() {
        return this.reset();
      };

      SelectionManager.prototype.focus = function(target) {
        var idx, old_sels;
        if (!target) {
          return this.selections[0];
        }
        idx = this.selections.indexOf(target);
        if (idx > -1) {
          old_sels = dou.util.clone(this.selections);
          this.selections.splice(idx, 1);
          this.selections.unshift(target);
          if (this.onselectionchange) {
            return this.onselectionchange.call(this.context, {
              added: [],
              removed: [],
              before: old_sels,
              after: this.selections
            });
          }
        } else {
          return this.toggle(target);
        }
      };

      SelectionManager.prototype.get = function() {
        return dou.util.clone(this.selections);
      };

      SelectionManager.prototype.toggle = function(target) {
        var added, idx, old_sels, removed;
        if (!target) {
          return;
        }
        old_sels = dou.util.clone(this.selections);
        idx = this.selections.indexOf(target);
        if (idx > -1) {
          removed = this.selections.splice(idx, 1);
        } else {
          added = [target];
          this.selections.unshift(target);
        }
        if (this.onselectionchange) {
          return this.onselectionchange.call(this.context, {
            added: added || [],
            removed: removed || [],
            before: old_sels,
            after: this.selections
          });
        }
      };

      SelectionManager.prototype.select = function(target) {
        var added, item, old_sels, removed;
        old_sels = dou.util.clone(this.selections);
        if (!(target instanceof Array)) {
          target = !target ? [] : [target];
        }
        this.selections = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = target.length; _i < _len; _i++) {
            item = target[_i];
            if ((!this.selectable_fn) || this.selectable_fn(item)) {
              _results.push(item);
            }
          }
          return _results;
        }).call(this);
        added = (function() {
          var _i, _len, _ref, _results;
          _ref = this.selections;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (old_sels.indexOf(item) === -1) {
              _results.push(item);
            }
          }
          return _results;
        }).call(this);
        removed = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = old_sels.length; _i < _len; _i++) {
            item = old_sels[_i];
            if (this.selections.indexOf(item) === -1) {
              _results.push(item);
            }
          }
          return _results;
        }).call(this);
        if (this.onselectionchange && (added.length > 0 || removed.length > 0)) {
          return this.onselectionchange.call(this.context, {
            added: added,
            removed: removed,
            before: old_sels,
            after: this.selections
          });
        }
      };

      SelectionManager.prototype.reset = function() {
        var old_sels;
        old_sels = this.selections;
        this.selections = [];
        if (old_sels.length > 0 && this.onselectionchange) {
          return this.onselectionchange.call(this.context, {
            added: [],
            removed: old_sels,
            before: old_sels,
            after: this.selections
          });
        }
      };

      return SelectionManager;

    })();
  });

}).call(this);
