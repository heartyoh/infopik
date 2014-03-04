(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['./Renderer'], function(Renderer) {
    "use strict";
    var RectRenderer;
    RectRenderer = (function(_super) {
      __extends(RectRenderer, _super);

      function RectRenderer() {
        return RectRenderer.__super__.constructor.apply(this, arguments);
      }

      RectRenderer.prototype.draw = function(component, context) {};

      return RectRenderer;

    })(Renderer);
    return RectRenderer;
  });

}).call(this);
