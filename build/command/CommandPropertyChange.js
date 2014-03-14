(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['dou', '../Command'], function(dou, Command) {
    "use strict";
    var CommandPropertyChange;
    return CommandPropertyChange = (function(_super) {
      __extends(CommandPropertyChange, _super);

      function CommandPropertyChange() {
        return CommandPropertyChange.__super__.constructor.apply(this, arguments);
      }

      CommandPropertyChange.prototype.execute = function() {
        var change, _i, _len, _ref, _results;
        _ref = this.params.changes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          change = _ref[_i];
          if (change.property) {
            _results.push(change.component.set(change.property, change.after));
          } else {
            _results.push(change.component.set(change.after));
          }
        }
        return _results;
      };

      CommandPropertyChange.prototype.unexecute = function() {
        var change, _i, _len, _ref, _results;
        _ref = this.params.changes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          change = _ref[_i];
          if (change.property) {
            _results.push(change.component.set(change.property, change.before));
          } else {
            _results.push(change.component.set(change.before));
          }
        }
        return _results;
      };

      return CommandPropertyChange;

    })(Command);
  });

}).call(this);
