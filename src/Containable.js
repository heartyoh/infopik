(function() {
  define(['dou'], function(dou) {
    "use strict";
    var add, containable_init, remove, select;
    containable_init = function() {
      return this.components = [];
    };
    add = function(comp) {
      var i, _i, _len;
      if (!(comp instanceof Array)) {
        return add.call(this, [comp]);
      }
      if (this.components.indexOf(comp) === -1) {
        for (_i = 0, _len = comp.length; _i < _len; _i++) {
          i = comp[_i];
          this.components.push(i);
        }
      }
      return this;
    };
    remove = function(comp) {
      var i, idx, _i, _len;
      if (!(comp instanceof Array)) {
        return remove.call(this, [comp]);
      }
      for (_i = 0, _len = comp.length; _i < _len; _i++) {
        i = comp[_i];
        idx = this.components.indexOf(i);
        if (idx > -1) {
          this.components.splice(idx, 1);
        }
      }
      return this;
    };
    select = function(selector) {
      var clone, i, _i, _len, _ref;
      clone = [];
      if (selector === void 0) {
        _ref = this.components;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          clone.push(i);
        }
      }
      return clone;
    };
    return function() {
      dou.mixin(this, [dou["with"].advice, dou["with"].lifecycle]);
      this.after('initialize', containable_init);
      this.add = add;
      this.remove = remove;
      return this.select = select;
    };
  });

}).call(this);
