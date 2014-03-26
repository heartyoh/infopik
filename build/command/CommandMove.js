(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['dou', '../Command'], function(dou, Command) {
    "use strict";
    var CommandMove;
    return CommandMove = (function(_super) {
      __extends(CommandMove, _super);

      function CommandMove() {
        return CommandMove.__super__.constructor.apply(this, arguments);
      }

      CommandMove.prototype.execute = function() {
        var layer, model, to, view;
        to = this.params.to;
        model = this.params.model;
        view = this.params.view;
        this.i_model = model.getContainer().indexOf(model);
        this.i_view = view.getZIndex();
        switch (to) {
          case 'FORWARD':
            view.moveUp();
            model.moveForward();
            break;
          case 'BACKWORD':
            view.moveDown();
            model.moveBackward();
            break;
          case 'FRONT':
            view.moveToTop();
            model.moveToFront();
            break;
          case 'BACK':
            view.moveToBottom();
            model.moveToBack();
        }
        layer = view.getLayer();
        if (layer) {
          return layer.draw();
        }
      };

      CommandMove.prototype.unexecute = function() {
        var layer, model, to, view;
        to = this.params.to;
        model = this.params.model;
        view = this.params.view;
        view.setZIndex(this.i_view);
        model.moveAt(this.i_model);
        layer = view.getLayer();
        if (layer) {
          return layer.draw();
        }
      };

      return CommandMove;

    })(Command);
  });

}).call(this);
