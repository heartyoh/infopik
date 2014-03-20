(function() {
  define(['dou', 'KineticJS', '../EventTracker', '../ComponentSelector', '../command/CommandPropertyChange'], function(dou, kin, EventTracker, ComponentSelector, CommandPropertyChange) {
    "use strict";
    var controller, createView, onadded, onchange, onchangemodel, onchangeselections, onclick, ondragend, ondragmove, ondragstart, onremoved, view_listener;
    createView = function(attributes) {
      var background, layer, offset, stage;
      stage = this.getView().getStage();
      offset = attributes.offset || {
        x: 0,
        y: 0
      };
      layer = new kin.Layer(attributes);
      background = new kin.Rect({
        draggable: true,
        listening: true,
        x: 0,
        y: 0,
        width: Math.min(stage.width() + offset.x, stage.width()),
        height: Math.min(stage.height() + offset.y, stage.height()),
        stroke: attributes.stroke,
        fill: 'cyan'
      });
      layer.add(background);
      layer.__background__ = background;
      return layer;
    };
    onadded = function(container, component, index, e) {};
    onremoved = function(container, component, e) {};
    onchangemodel = function(after, before, e) {
      var layer;
      layer = e.listener;
      if (before) {
        layer.remove(before);
      }
      if (after) {
        return layer.add(after);
      }
    };
    onchangeselections = function(after, before, added, removed) {
      return console.log('selection-changed', after);
    };
    onchange = function(component, before, after) {};
    ondragstart = function(e) {
      var background, layer, layer_offset, mode, node, offset;
      layer = this.listener;
      background = layer.__background__;
      node = e.targetNode;
      this.context.selectionManager.select(node);
      if (e.targetNode && e.targetNode !== background) {
        return;
      }
      layer_offset = layer.offset();
      background.setAttrs({
        x: layer_offset.x + 20,
        y: layer_offset.y + 20
      });
      this.start_point = {
        x: e.offsetX,
        y: e.offsetY
      };
      this.origin_offset = layer.offset();
      offset = {
        x: this.start_point.x + this.origin_offset.x,
        y: this.start_point.y + this.origin_offset.y
      };
      mode = 'MOVE';
      if (mode === 'SELECT') {
        this.selectbox = new kin.Rect({
          stroke: 'black',
          strokeWidth: 1,
          dash: [3, 3]
        });
        layer.add(this.selectbox);
        this.selectbox.setAttrs(offset);
      } else if (mode === 'MOVE') {

      } else {

      }
      layer.draw();
      return e.cancelBubble = true;
    };
    ondragmove = function(e) {
      var background, layer, mode, x, y;
      layer = this.listener;
      background = layer.__background__;
      if (e.targetNode && e.targetNode !== background) {
        return;
      }
      mode = 'MOVE';
      if (mode === 'SELECT') {
        background.setAttrs({
          x: this.origin_offset.x + 20,
          y: this.origin_offset.y + 20
        });
        this.selectbox.setAttrs({
          width: e.offsetX - this.start_point.x,
          height: e.offsetY - this.start_point.y
        });
      } else if (mode === 'MOVE') {
        x = this.origin_offset.x - (e.offsetX - this.start_point.x);
        y = this.origin_offset.y - (e.offsetY - this.start_point.y);
        layer.offset({
          x: x,
          y: y
        });
        background.setAttrs({
          x: x + 20,
          y: y + 20
        });
        layer.fire('change-offset', {
          x: x,
          y: y
        }, false);
      } else {

      }
      layer.batchDraw();
      return e.cancelBubble = true;
    };
    ondragend = function(e) {
      var application, background, cmd, component, layer, mode, node, x, y;
      application = this.context;
      node = e.targetNode;
      if (node.getModel) {
        component = node.getModel();
      }
      if (component) {
        cmd = new CommandPropertyChange({
          changes: [
            {
              component: component,
              before: {
                x: component.get('x'),
                y: component.get('y')
              },
              after: {
                x: node.x(),
                y: node.y()
              }
            }
          ]
        });
        application.execute(cmd);
      }
      layer = this.listener;
      background = layer.__background__;
      if (e.targetNode && e.targetNode !== background) {
        return;
      }
      mode = 'MOVE';
      if (mode === 'SELECT') {
        background.setAttrs({
          x: this.origin_offset.x + 20,
          y: this.origin_offset.y + 20
        });
        this.selectbox.remove();
        delete this.selectbox;
      } else if (mode === 'MOVE') {
        x = Math.max(this.origin_offset.x - (e.offsetX - this.start_point.x), -20);
        y = Math.max(this.origin_offset.y - (e.offsetY - this.start_point.y), -20);
        layer.offset({
          x: x,
          y: y
        });
        background.setAttrs({
          x: x + 20,
          y: y + 20
        });
        layer.fire('change-offset', {
          x: x,
          y: y
        }, false);
      } else {

      }
      layer.draw();
      return e.cancelBubble = true;
    };
    onclick = function(e) {
      var node;
      node = e.targetNode;
      return this.context.selectionManager.select(node);
    };
    controller = {
      '(root)': {
        '(root)': {
          'change-model': onchangemodel,
          'change-selections': onchangeselections
        }
      },
      '(self)': {
        '(self)': {
          'added': onadded,
          'removed': onremoved
        },
        '(all)': {
          'change': onchange
        }
      }
    };
    view_listener = {
      '(self)': {
        dragstart: ondragstart,
        dragmove: ondragmove,
        dragend: ondragend,
        click: onclick
      }
    };
    return {
      type: 'content-edit-layer',
      name: 'content-edit-layer',
      containable: true,
      container_type: 'layer',
      description: 'Selection Edit Layer Specification',
      defaults: {
        listening: true,
        draggable: false
      },
      controller: controller,
      view_listener: view_listener,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_content_edit_layer.png'
    };
  });

}).call(this);
