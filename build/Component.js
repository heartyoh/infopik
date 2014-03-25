(function() {
  define(['dou', './MVCMixin'], function(dou, MVCMixin) {
    "use strict";
    var Component;
    Component = (function() {
      function Component(type, container) {
        this.type = type;
        this.container = container;
      }

      Component.prototype.getContainer = function() {
        return this.container;
      };

      Component.prototype.setContainer = function(container) {
        return this.container = container;
      };

      Component.prototype.moveAt = function(index) {
        if (!this.getContainer()) {
          return;
        }
        return this.container.moveChildAt(index, this);
      };

      Component.prototype.moveUp = function() {
        if (!this.getContainer()) {
          return;
        }
        return this.container.moveChildUp(this);
      };

      Component.prototype.moveDown = function() {
        if (!this.getContainer()) {
          return;
        }
        return this.container.moveChildDown(this);
      };

      Component.prototype.moveToTop = function() {
        if (!this.getContainer()) {
          return;
        }
        return this.container.moveChildToTop(this);
      };

      Component.prototype.moveToBottom = function() {
        if (!this.getContainer()) {
          return;
        }
        return this.container.moveChildToBottom(this);
      };

      return Component;

    })();
    return dou.mixin(Component, [dou["with"].advice, dou["with"].event, dou["with"].property, dou["with"].lifecycle, dou["with"].serialize, MVCMixin.model]);
  });

}).call(this);
