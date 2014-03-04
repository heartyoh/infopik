(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['./Container'], function(Container) {
    "use strict";
    var EDIT_MODE, Presenter;
    EDIT_MODE = {
      SELECT: 1,
      CREATE: 2
    };
    Presenter = (function(_super) {
      __extends(Presenter, _super);

      function Presenter() {}

      Presenter.prototype.defaults = {
        edit_mode: EDIT_MODE.SELECT,
        width: 600,
        height: 800
      };

      return Presenter;

    })(Container);
    Presenter.EDIT_MODE = EDIT_MODE;
    return Presenter;
  });

}).call(this);
