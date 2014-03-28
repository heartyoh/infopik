(function() {
  define(['dou', 'KineticJS', '../command/CommandPropertyChange', './SpecContentEditLayerExportable'], function(dou, kin, CommandPropertyChange, exportable) {
    "use strict";
    var model_event_map, model_initialize, onadded, onchange, onchangemodel, onchangeoffset, onchangeselections, onclick, ondragend, ondragmove, ondragstart, onremoved, onresize, view_event_map, view_factory, _mousePointOnEvent, _stuckBackgroundPosition;
    view_factory = function(attributes) {
      var background, layer, offset, stage;
      stage = this.getView().getStage();
      offset = attributes.offset || {
        x: 0,
        y: 0
      };
      layer = new kin.Layer(attributes);
      background = new kin.Rect({
        name: 'background for ruler-layer',
        draggable: true,
        listening: true,
        x: 0,
        y: 0,
        width: Math.min(stage.width() + offset.x, stage.width()),
        height: Math.min(stage.height() + offset.y, stage.height()),
        stroke: attributes.stroke,
        fill: 'cyan',
        opacity: 0.1
      });
      layer.getBackground = function() {
        return background;
      };
      layer.getOriginOffset = function() {
        return offset;
      };
      layer.add(background);
      return layer;
    };
    model_initialize = function() {};
    onadded = function(container, component, index, e) {};
    onremoved = function(container, component, e) {};
    onchangemodel = function(after, before, e) {
      var model;
      model = e.listener;
      if (before) {
        model.remove(before);
        before.dispose();
      }
      if (after) {
        return model.add(after);
      }
    };
    onchangeselections = function(after, before, added, removed) {
      var controller;
      controller = this;
      if (after.length > 0) {
        return console.log('selection-changed', after[0], controller.getAttachedModel(after[0]));
      }
    };
    onchange = function(component, before, after) {
      var node;
      node = component.getViews()[0];
      node.setAttrs(after);
      return node.getLayer().batchDraw();
    };
    _stuckBackgroundPosition = function(layer) {
      var layerOffset, layerOriginOffset;
      layerOffset = layer.offset();
      layerOriginOffset = layer.getOriginOffset();
      return layer.getBackground().position({
        x: layerOffset.x - layerOriginOffset.x,
        y: layerOffset.y - layerOriginOffset.y
      });
    };
    _mousePointOnEvent = function(layer, e) {
      var scale;
      scale = layer.getStage().scale();
      return {
        x: Math.round(e.offsetX / scale.x),
        y: Math.round(e.offsetY / scale.y)
      };
    };
    ondragstart = function(e) {
      var background, controller, layer, model, node, offset;
      controller = this.context;
      layer = this.listener;
      model = controller.getAttachedModel(layer);
      background = layer.getBackground();
      node = e.targetNode;
      controller.selectionManager.select(node);
      if (node && node !== background) {
        return;
      }
      this.layerOffsetOnStart = layer.offset();
      this.mousePointOnStart = _mousePointOnEvent(layer, e);
      offset = {
        x: this.mousePointOnStart.x + this.layerOffsetOnStart.x,
        y: this.mousePointOnStart.y + this.layerOffsetOnStart.y
      };
      this.selectbox = new kin.Rect({
        stroke: 'black',
        strokeWidth: 1,
        dash: [3, 3]
      });
      layer.add(this.selectbox);
      this.selectbox.setAttrs(offset);
      _stuckBackgroundPosition(layer);
      layer.draw();
      return e.cancelBubble = true;
    };
    ondragmove = function(e) {
      var background, controller, layer, model, mousePointCurrent, moveDelta, node;
      controller = this.context;
      layer = this.listener;
      model = controller.getAttachedModel(layer);
      background = layer.getBackground();
      node = e.targetNode;
      if (node && node !== background) {
        return;
      }
      mousePointCurrent = _mousePointOnEvent(layer, e);
      moveDelta = {
        x: mousePointCurrent.x - this.mousePointOnStart.x,
        y: mousePointCurrent.y - this.mousePointOnStart.y
      };
      this.selectbox.setAttrs({
        width: moveDelta.x,
        height: moveDelta.y
      });
      _stuckBackgroundPosition(layer);
      layer.batchDraw();
      return e.cancelBubble = true;
    };
    ondragend = function(e) {
      var background, cmd, controller, dragmodel, dragview, layer, model;
      controller = this.context;
      layer = this.listener;
      model = controller.getAttachedModel(layer);
      dragview = e.targetNode;
      dragmodel = controller.getAttachedModel(dragview);
      if (dragmodel) {
        cmd = new CommandPropertyChange({
          changes: [
            {
              component: dragmodel,
              before: {
                x: dragmodel.get('x'),
                y: dragmodel.get('y')
              },
              after: {
                x: dragview.x(),
                y: dragview.y()
              }
            }
          ]
        });
        controller.execute(cmd);
      }
      layer = this.listener;
      background = layer.getBackground();
      if (e.targetNode && e.targetNode !== background) {
        return;
      }
      this.selectbox.remove();
      delete this.selectbox;
      _stuckBackgroundPosition(layer);
      layer.draw();
      return e.cancelBubble = true;
    };
    onclick = function(e) {
      var node;
      node = e.targetNode;
      return this.context.selectionManager.select(node);
    };
    onresize = function(e) {
      var background, layer;
      layer = this.listener;
      background = layer.getBackground();
      background.setSize(e.after);
      return layer.batchDraw();
    };
    onchangeoffset = function(e) {
      var layer;
      layer = this.listener;
      return _stuckBackgroundPosition(layer);
    };
    model_event_map = {
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
    view_event_map = {
      '(self)': {
        dragstart: ondragstart,
        dragmove: ondragmove,
        dragend: ondragend,
        click: onclick,
        'change-offset': onchangeoffset
      },
      '(root)': {
        resize: onresize
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
      model_event_map: model_event_map,
      view_event_map: view_event_map,
      model_initialize_fn: model_initialize,
      view_factory_fn: view_factory,
      toolbox_image: 'images/toolbox_content_edit_layer.png',
      exportable: exportable
    };
  });

}).call(this);
