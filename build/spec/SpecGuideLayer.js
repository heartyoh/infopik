(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var controller, createView, onadded, onchange, ondragend, ondragmove, ondragstart, onremoved, view_listener;
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
    ondragstart = function(e) {
      var node, offset_x, offset_y, stage, textx, texty, view, view_offset;
      view = this.listener;
      stage = view.getStage();
      this.width = stage.getWidth();
      this.height = stage.getHeight();
      this.mouse_origin = {
        x: e.x,
        y: e.y
      };
      node = e.targetNode;
      this.node_origin = node.getAbsolutePosition();
      view_offset = view.offset();
      offset_x = this.node_origin.x + view_offset.x;
      offset_y = this.node_origin.y + view_offset.y;
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
      view.add(this.vert);
      view.add(this.hori);
      view.add(this.text);
      return view.batchDraw();
    };
    ondragmove = function(e) {
      var node, node_new_pos, offset_x, offset_y, textx, texty, view, view_offset, x, y;
      view = this.listener;
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
      view_offset = view.offset();
      offset_x = x + view_offset.x;
      offset_y = y + view_offset.y;
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
      return view.draw();
    };
    ondragend = function(e) {
      var view;
      view = this.listener;
      this.vert.remove();
      this.hori.remove();
      this.text.remove();
      return view.draw();
    };
    onadded = function(container, component, index, e) {};
    onremoved = function(container, component, e) {
      var controller, view;
      controller = this;
      view = controller.getView();
      return this.getEventHandler().off(view, guide_handler);
    };
    controller = {
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
    view_listener = {
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
      controller: controller,
      view_listener: view_listener,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_guide_layer.png'
    };
  });

}).call(this);
