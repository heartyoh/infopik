(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var bound_fn, controller, createView, guide_handler, onadded, onchange, onchangemodel, onremoved, view_listener;
    createView = function(attributes) {
      return new kin.Layer(attributes);
    };
    onchange = function(component, before, after) {
      var layer, msg, self;
      self = this;
      layer = this.layer;
      this.changes = (this.changes || 0) + 1;
      if (!this.text) {
        this.text = new kin.Text({
          x: 10,
          y: 10,
          listening: false,
          fontSize: 12,
          fontFamily: 'Calibri',
          fill: 'green'
        });
        layer.add(this.text);
      }
      msg = "[ PropertyChange ] " + component.type + " : " + (component.get('id')) + "\n[ Before ] " + (JSON.stringify(before)) + "\n[ After ] " + (JSON.stringify(after));
      this.text.setAttr('text', msg);
      layer.draw();
      return setTimeout(function() {
        if ((--self.changes) > 0) {
          return;
        }
        self.text.remove();
        delete self.text;
        return layer.draw();
      }, 5000);
    };
    onchangemodel = function(after, before) {
      var appcontext, layer, screen, _i, _len, _ref, _results;
      appcontext = this;
      _ref = this.findComponent('guide-layer');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        screen = _ref[_i];
        layer = (appcontext.findViewByComponent(screen))[0];
        if (before) {
          before.off('change', onchange);
        }
        if (after) {
          _results.push(after.on('change', onchange, {
            layer: layer
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    bound_fn = function(x, y) {
      var node, pos;
      node = this;
      pos = node.getAbsolutePosition();
      pos.x = Math.round(pos.x / 10) * 10;
      pos.y = Math.round(pos.y / 10) * 10;
      return pos;
    };
    guide_handler = {
      dragstart: function(e) {
        var layer, node, pos, textx, texty, x, y;
        this.mouse_origin = {
          x: e.x,
          y: e.y
        };
        node = e.targetNode;
        this.node_origin = node.getAbsolutePosition();
        pos = node.getAbsolutePosition();
        x = pos.x;
        y = pos.y;
        this.vert = new kin.Line({
          stroke: 'red',
          tension: 1,
          points: [x, 0, x, 1000]
        });
        this.hori = new kin.Line({
          stroke: 'red',
          tension: 1,
          points: [0, y, 1000, y]
        });
        this.text = new kin.Text({
          x: x,
          y: y,
          listening: false,
          fontSize: 12,
          fontFamily: 'Calibri',
          fill: 'green'
        });
        this.text.setAttr('text', "[ " + x + "(" + (node.x()) + "), " + y + "(" + (node.y()) + ") ]");
        textx = Math.max(x, 0) > (this.text.width() + 10) ? x - (this.text.width() + 10) : Math.max(x + 10, 10);
        texty = Math.max(y, 0) > (this.text.height() + 10) ? y - (this.text.height() + 10) : Math.max(y + 10, 10);
        this.text.setAttrs({
          x: textx,
          y: texty
        });
        layer = this.layer;
        layer.add(this.vert);
        layer.add(this.hori);
        layer.add(this.text);
        return layer.draw();
      },
      dragmove: function(e) {
        var node, pos, textx, texty, x, y;
        pos = {
          x: e.x - this.mouse_origin.x + this.node_origin.x,
          y: e.y - this.mouse_origin.y + this.node_origin.y
        };
        x = Math.round(pos.x / 10) * 10;
        y = Math.round(pos.y / 10) * 10;
        node = e.targetNode;
        node.setAbsolutePosition({
          x: x,
          y: y
        });
        this.vert.setAttrs({
          points: [x, 0, x, 1000]
        });
        this.hori.setAttrs({
          points: [0, y, 1000, y]
        });
        this.text.setAttr('text', "[ " + x + "(" + (node.x()) + "), " + y + "(" + (node.y()) + ") ]");
        textx = Math.max(x, 0) > (this.text.width() + 10) ? x - (this.text.width() + 10) : Math.max(x + 10, 10);
        texty = Math.max(y, 0) > (this.text.height() + 10) ? y - (this.text.height() + 10) : Math.max(y + 10, 10);
        this.text.setAttrs({
          x: textx,
          y: texty
        });
        return this.layer.draw();
      },
      dragend: function(e) {
        this.vert.remove();
        this.hori.remove();
        this.text.remove();
        return this.layer.draw();
      }
    };
    onadded = function(container, component, index, e) {
      var layer;
      layer = (this.findView("\#" + (component.get('id'))))[0];
      return this.getEventTracker().on(this.getView(), guide_handler, {
        layer: layer
      });
    };
    onremoved = function(container, component, e) {
      var app;
      app = this.getView();
      return this.getEventHandler().off(app, guide_handler);
    };
    controller = {
      '#application': {
        'change-model': onchangemodel
      },
      'guide-layer': {
        'added': onadded,
        'removed': onremoved
      }
    };
    view_listener = {
      dragmove: function(e) {
        var node;
        return node = e.targetNode;
      }
    };
    return {
      type: 'guide-layer',
      name: 'guide-layer',
      containable: true,
      container_type: 'layer',
      description: 'Editing Guide Specification',
      defaults: {
        draggable: false
      },
      controller: controller,
      view_listener: view_listener,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_guide_layer.png'
    };
  });

}).call(this);
