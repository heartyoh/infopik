(function() {
  define(['dou', './MVCMixin'], function(dou, MVCMixin) {
    "use strict";
    var Component;
    Component = (function() {
      function Component(type, container) {
        this.type = type;
        this.container = container;
      }

      Component.prototype.dispose = function() {
        return this.setContainer(null);
      };

      Component.prototype.getContainer = function() {
        return this.container;
      };

      Component.prototype.setContainer = function(container) {
        if (container === this.container) {
          return;
        }
        if (this.container) {
          this.container.remove(this);
        }
        this.container = container;
        if (this.container) {
          return this.container.add(this);
        }
      };

      Component.prototype.moveAt = function(index) {
        if (!this.getContainer()) {
          return;
        }
        return this.container.moveChildAt(index, this);
      };

      Component.prototype.moveForward = function() {
        if (!this.getContainer()) {
          return;
        }
        return this.container.moveChildForward(this);
      };

      Component.prototype.moveBackward = function() {
        if (!this.getContainer()) {
          return;
        }
        return this.container.moveChildBackward(this);
      };

      Component.prototype.moveToFront = function() {
        if (!this.getContainer()) {
          return;
        }
        return this.container.moveChildToFront(this);
      };

      Component.prototype.moveToBack = function() {
        if (!this.getContainer()) {
          return;
        }
        return this.container.moveChildToBack(this);
      };

      return Component;

    })();
    return dou.mixin(Component, [dou["with"].advice, dou["with"].event, dou["with"].property, dou["with"].lifecycle, dou["with"].serialize, dou["with"].disposer, MVCMixin.model]);
  });

}).call(this);
