(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var abs_calculator, createView, logic_calculator, model_event_map, onadded, onchange, ondragend, ondragmove, ondragstart, onremoved, view_event_map;
    createView = function(attributes) {
      return new kin.Layer(attributes);
    };
    onchange = function(component, before, after, e) {
      var controller, model, msg, self, view;
      controller = this;
      model = e.listener;
      view = controller.getAttachedViews(model)[0];
      self = model._track = model._track || {};
      self.changes = (self.changes || 0) + 1;
      if (!self.text) {
        self.text = new kin.Text({
          x: 10,
          y: 10,
          listening: false,
          fontSize: 12,
          fontFamily: 'Calibri',
          fill: 'green'
        });
        view.add(self.text);
      }
      msg = "[ PropertyChange ] " + component.type + " : " + (component.get('id')) + "\n[ Before ] " + (JSON.stringify(before)) + "\n[ After ] " + (JSON.stringify(after));
      self.text.setAttr('text', msg);
      view.draw();
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
          return view.draw();
        }, 1000);
      }, 5000);
    };
    abs_calculator = function(layer, pos) {
      return {
        x: (layer.offsetX() + pos.x) * layer.getStage().getScale().x,
        y: (layer.offsetY() + pos.y) * layer.getStage().getScale().y
      };
    };
    logic_calculator = function(layer, pos) {
      return {
        x: pos.x / layer.getStage().getScale().x + layer.offsetX(),
        y: pos.y / layer.getStage().getScale().y + layer.offsetY()
      };
    };
    ondragstart = function(e) {
      var layer, node, stage, textx, texty, x, y;
      layer = this.listener;
      node = e.targetNode;
      stage = layer.getStage();
      this.scale = stage.getScale();
      this.width = stage.getWidth();
      this.height = stage.getHeight();
      this.mouse_origin = {
        x: Math.round(e.x / this.scale.x),
        y: Math.round(e.y / this.scale.y)
      };
      this.node_origin = node.position();
      this.layer_offset = {
        x: node.getLayer().offset().x - layer.offset().x,
        y: node.getLayer().offset().y - layer.offset().y
      };
      x = this.node_origin.x - this.layer_offset.x;
      y = this.node_origin.y - this.layer_offset.y;
      this.vert = new kin.Line({
        stroke: 'red',
        tension: 1,
        points: [x, 0, x, this.height]
      });
      this.hori = new kin.Line({
        stroke: 'red',
        tension: 1,
        points: [0, y, this.width, y]
      });
      this.text = new kin.Text({
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
      layer.add(this.vert);
      layer.add(this.hori);
      layer.add(this.text);
      return layer.batchDraw();
    };
    ondragmove = function(e) {
      var layer, mouse_current, node, node_current, node_x, node_y, textx, texty, x, y;
      layer = this.listener;
      node = e.targetNode;
      mouse_current = {
        x: Math.round(e.x / this.scale.x),
        y: Math.round(e.y / this.scale.y)
      };
      node_current = {
        x: (mouse_current.x - this.mouse_origin.x) + this.node_origin.x,
        y: (mouse_current.y - this.mouse_origin.y) + this.node_origin.y
      };
      node_x = Math.round(node_current.x / 10) * 10;
      node_y = Math.round(node_current.y / 10) * 10;
      node.position({
        x: node_x,
        y: node_y
      });
      x = node_x - this.layer_offset.x;
      y = node_y - this.layer_offset.y;
      this.vert.setAttrs({
        points: [x, 0, x, this.height]
      });
      this.hori.setAttrs({
        points: [0, y, this.width, y]
      });
      this.text.setAttr('text', "[ " + x + "(" + (node.x()) + "), " + y + "(" + (node.y()) + ") ]");
      textx = Math.max(x, 0) > (this.text.width() + 10) ? x - (this.text.width() + 10) : Math.max(x + 10, 10);
      texty = Math.max(y, 0) > (this.text.height() + 10) ? y - (this.text.height() + 10) : Math.max(y + 10, 10);
      this.text.setAttrs({
        x: textx,
        y: texty
      });
      return layer.batchDraw();
    };
    ondragend = function(e) {
      var layer;
      layer = this.listener;
      this.vert.remove();
      this.hori.remove();
      this.text.remove();
      return layer.batchDraw();
    };
    onadded = function(container, component, index, e) {};
    onremoved = function(container, component, e) {
      var controller, view;
      controller = this;
      return view = controller.getView();
    };
    model_event_map = {
      '(root)': {
        '(all)': {
          'change': onchange
        }
      },
      '(self)': {
        '(self)': {
          'added': onadded,
          'removed': onremoved
        }
      }
    };
    view_event_map = {
      '(root)': {
        dragstart: ondragstart,
        dragmove: ondragmove,
        dragend: ondragend
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
      model_event_map: model_event_map,
      view_event_map: view_event_map,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_guide_layer.png'
    };
  });

}).call(this);
