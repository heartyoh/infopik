(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['dou', './Component'], function(dou, Component) {
    "use strict";
    var Container, add, add_component, remove, remove_component, select;
    add_component = function(container, component) {
      var e, len;
      len = container.__components__.push(component);
      e = {
        container: container,
        component: component,
        index: len - 1
      };
      container.trigger('add', e);
      if (!(component instanceof Component)) {
        return;
      }
      component.delegate_on(container);
      return component.trigger('added', e);
    };
    remove_component = function(container, component) {
      var e, idx;
      idx = container.__components__.indexOf(component);
      if (idx === -1) {
        return;
      }
      if (idx > -1) {
        container.__components__.splice(idx, 1);
      }
      e = {
        container: container,
        component: component
      };
      container.trigger('remove', e);
      if (!(component instanceof Component)) {
        return;
      }
      component.trigger('removed', e);
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
    select = function(selector) {
      var clone, i, _i, _len, _ref;
      if (!this.__components__) {
        return;
      }
      clone = [];
      if (selector === void 0) {
        _ref = this.__components__;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          clone.push(i);
        }
      }
      return clone;
    };
    Container = (function(_super) {
      __extends(Container, _super);

      function Container(type) {
        Container.__super__.constructor.call(this, type);
      }

      Container.prototype.add = add;

      Container.prototype.remove = remove;

      Container.prototype.select = select;

      return Container;

    })(Component);
    return dou.mixin(Container, [dou["with"].advice, dou["with"].lifecycle]);
  });

}).call(this);
