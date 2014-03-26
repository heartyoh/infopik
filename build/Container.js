(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['dou', './Component'], function(dou, Component) {
    "use strict";
    var Container, EMPTY, add, add_component, forEach, getAt, indexOf, moveChildAt, moveChildBackward, moveChildForward, moveChildToBack, moveChildToFront, remove, remove_component, size;
    EMPTY = [];
    add_component = function(container, component) {
      var containable, index, oldContainer;
      containable = component instanceof Component;
      if (containable) {
        oldContainer = component.getContainer();
        if (oldContainer) {
          if (container === oldContainer) {
            return;
          }
          remove_component(container, component);
        }
      }
      index = (container.__components__.push(component)) - 1;
      if (containable) {
        component.setContainer(container);
      }
      container.trigger('add', container, component, index);
      if (!containable) {
        return;
      }
      component.delegate_on(container);
      return component.trigger('added', container, component, index);
    };
    remove_component = function(container, component) {
      var containable, idx;
      containable = component instanceof Component;
      idx = container.__components__.indexOf(component);
      if (idx === -1) {
        return;
      }
      if (idx > -1) {
        container.__components__.splice(idx, 1);
      }
      if (containable) {
        component.setContainer(null);
      }
      container.trigger('remove', container, component);
      if (!(component instanceof Component)) {
        return;
      }
      component.trigger('removed', container, component);
      return component.delegate_off(container);
    };
    add = function(comp) {
      var i, _i, _len;
      this.__components__ || (this.__components__ = []);
      if (!(comp instanceof Array)) {
        return add.call(this, [comp]);
      }
      if (this.__components__.indexOf(i) === -1) {
        for (_i = 0, _len = comp.length; _i < _len; _i++) {
          i = comp[_i];
          add_component(this, i);
        }
      }
      return this;
    };
    remove = function(comp) {
      var i, _i, _len;
      if (!(comp instanceof Array)) {
        return remove.call(this, [comp]);
      }
      if (!this.__components__) {
        return;
      }
      for (_i = 0, _len = comp.length; _i < _len; _i++) {
        i = comp[_i];
        remove_component(this, i);
      }
      return this;
    };
    getAt = function(index) {
      if (this.__components__) {
        return this.__components__[index];
      }
    };
    forEach = function(fn, context) {
      if (!this.__components__) {
        return;
      }
      return this.__components__.forEach(fn, context);
    };
    indexOf = function(item) {
      return (this.__components__ || EMPTY).indexOf(item);
    };
    size = function() {
      return (this.__components__ || EMPTY).length;
    };
    moveChildAt = function(index, child) {
      var head, oldIndex, tail;
      oldIndex = this.indexOf(child);
      if (oldIndex === -1) {
        return;
      }
      head = this.__components__.splice(0, oldIndex);
      tail = this.__components__.splice(1);
      this.__components__ = head.concat(tail);
      index = Math.max(0, index);
      index = Math.min(index, this.__components__.length);
      head = this.__components__.splice(0, index);
      return this.__components__ = head.concat(child, this.__components__);
    };
    moveChildForward = function(child) {
      var index;
      index = this.indexOf(child);
      if ((index === -1) || (index === this.size() - 1)) {
        return;
      }
      this.__components__[index] = this.__components__[index + 1];
      return this.__components__[index + 1] = child;
    };
    moveChildBackward = function(child) {
      var index;
      index = this.indexOf(child);
      if (index === -1 || index === 0) {
        return;
      }
      this.__components__[index] = this.__components__[index - 1];
      return this.__components__[index - 1] = child;
    };
    moveChildToFront = function(child) {
      var head, index, tail;
      index = this.indexOf(child);
      if (index === -1 || (index === this.size() - 1)) {
        return;
      }
      head = this.__components__.splice(0, index);
      tail = this.__components__.splice(1);
      return this.__components__ = head.concat(tail, this.__components__);
    };
    moveChildToBack = function(child) {
      var head, index, tail;
      index = this.indexOf(child);
      if (index === -1 || index === 0) {
        return;
      }
      head = this.__components__.splice(0, index);
      tail = this.__components__.splice(1);
      return this.__components__ = this.__components__.concat(head, tail);
    };
    Container = (function(_super) {
      __extends(Container, _super);

      function Container(type) {
        Container.__super__.constructor.call(this, type);
      }

      Container.prototype.dispose = function() {
        var children, component, _i, _len;
        if (this.__components__) {
          children = dou.util.clone(this.__components__);
          for (_i = 0, _len = children.length; _i < _len; _i++) {
            component = children[_i];
            component.dispose();
          }
          this.__components__ = null;
        }
        return Container.__super__.dispose.call(this);
      };

      Container.prototype.add = add;

      Container.prototype.remove = remove;

      Container.prototype.size = size;

      Container.prototype.getAt = getAt;

      Container.prototype.indexOf = indexOf;

      Container.prototype.forEach = forEach;

      Container.prototype.moveChildAt = moveChildAt;

      Container.prototype.moveChildForward = moveChildForward;

      Container.prototype.moveChildBackward = moveChildBackward;

      Container.prototype.moveChildToFront = moveChildToFront;

      Container.prototype.moveChildToBack = moveChildToBack;

      return Container;

    })(Component);
    return Container;
  });

}).call(this);
