(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['dou', './Component', './Containable'], function(dou, Component, Containable) {
    "use strict";
    var Container;
    Container = (function(_super) {
      __extends(Container, _super);

      function Container(type) {
        Container.__super__.constructor.call(this, type);
      }

      return Container;

    })(Component);
    return dou.mixin(Container, Containable);
  });

}).call(this);
