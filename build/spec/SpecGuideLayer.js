(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var controller, createView, guide_handler, onadded, onchange, onchangemodel, onremoved, view_listener;
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
        var tween;
        if ((--self.changes) > 0) {
          return;
        }
        tween = new Kinetic.Tween({
          node: self.text,
          opacity: 0,
          duration: 1,
          easing: kin.Easings.EaseOut
        });
        tween.play();
        return setTimeout(function() {
          if (self.changes > 0) {
            tween.reset();
            tween.destroy();
            return;
          }
          tween.finish();
          tween.destroy();
          self.text.remove();
          delete self.text;
          return layer.draw();
        }, 1000);
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
    guide_handler = {
      dragstart: function(e) {
        var layer, layer_offset, node, offset_x, offset_y, textx, texty;
        this.mouse_origin = {
          x: e.x,
          y: e.y
        };
        node = e.targetNode;
        this.node_origin = node.getAbsolutePosition();
        layer_offset = this.layer.offset();
        offset_x = this.node_origin.x + layer_offset.x;
        offset_y = this.node_origin.y + layer_offset.y;
        this.vert = new kin.Line({
          stroke: 'red',
          tension: 1,
          points: [offset_x, 0, offset_x, this.height]
        });
        this.hori = new kin.Line({
          stroke: 'red',
          tension: 1,
          points: [0, offset_y, this.width, offset_y]
        });
        this.text = new kin.Text({
          listening: false,
          fontSize: 12,
          fontFamily: 'Calibri',
          fill: 'green'
        });
        this.text.setAttr('text', "[ " + offset_x + "(" + (node.x()) + "), " + offset_y + "(" + (node.y()) + ") ]");
        textx = Math.max(offset_x, 0) > (this.text.width() + 10) ? offset_x - (this.text.width() + 10) : Math.max(offset_x + 10, 10);
        texty = Math.max(offset_y, 0) > (this.text.height() + 10) ? offset_y - (this.text.height() + 10) : Math.max(offset_y + 10, 10);
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
        var layer_offset, node, node_new_pos, offset_x, offset_y, textx, texty, x, y;
        node_new_pos = {
          x: (e.x - this.mouse_origin.x) + this.node_origin.x,
          y: (e.y - this.mouse_origin.y) + this.node_origin.y
        };
        x = Math.round(node_new_pos.x / 10) * 10;
        y = Math.round(node_new_pos.y / 10) * 10;
        node = e.targetNode;
        node.setAbsolutePosition({
          x: x,
          y: y
        });
        layer_offset = this.layer.offset();
        offset_x = x + layer_offset.x;
        offset_y = y + layer_offset.y;
        this.vert.setAttrs({
          points: [offset_x, 0, offset_x, this.height]
        });
        this.hori.setAttrs({
          points: [0, offset_y, this.width, offset_y]
        });
        this.text.setAttr('text', "[ " + offset_x + "(" + (node.x()) + "), " + offset_y + "(" + (node.y()) + ") ]");
        textx = Math.max(offset_x, 0) > (this.text.width() + 10) ? offset_x - (this.text.width() + 10) : Math.max(offset_x + 10, 10);
        texty = Math.max(offset_y, 0) > (this.text.height() + 10) ? offset_y - (this.text.height() + 10) : Math.max(offset_y + 10, 10);
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
      var height, layer, stage, width;
      layer = (this.findView("\#" + (component.get('id'))))[0];
      stage = this.getView().getStage();
      width = stage.getWidth();
      height = stage.getHeight();
      return this.getEventTracker().on(this.getView(), guide_handler, {
        layer: layer,
        width: width,
        height: height
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
