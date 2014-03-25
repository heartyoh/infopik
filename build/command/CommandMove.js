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
        var model, to, view;
        to = this.params.to;
        model = this.params.model;
        view = this.params.view;
        this.i_model = model.getContainer().indexOf(model);
        this.i_view = view.getZIndex();
        switch (to) {
          case 'UP':
            view.moveUp();
            model.moveUp();
            break;
          case 'DOWN':
            view.moveDown();
            model.moveDown();
            break;
          case 'TOP':
            view.moveToTop();
            model.moveToTop();
            break;
          case 'BOTTOM':
            view.moveToBottom();
            model.moveToBottom();
        }
        return view.getLayer().draw();
      };

      CommandMove.prototype.unexecute = function() {
        var model, to, view;
        to = this.params.to;
        model = this.params.model;
        view = this.params.view;
        switch (to) {
          case 'UP':
            view.moveDown();
            model.moveDown();
            break;
          case 'DOWN':
            view.moveUp();
            model.moveUp();
            break;
          case 'TOP':
            view.setZIndex(this.i_view);
            model.moveAt(this.i_model);
            break;
          case 'BOTTOM':
            view.setZIndex(this.i_view);
            model.moveAt(this.i_model);
        }
        return view.getLayer().draw();
      };

      return CommandMove;

    })(Command);
  });

}).call(this);
