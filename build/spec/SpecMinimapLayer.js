(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var model_event_map, onchange, ondragend, ondragmove, ondragstart, onresize, view_event_map, view_factory, _mousePointOnEvent;
    view_factory = function(attributes) {
      var background, controller, layer, stage, targetLayer, zeroOffset;
      stage = this.getView().getStage();
      layer = new kin.Layer(attributes);
      controller = this;
      targetLayer = null;
      zeroOffset = {
        x: 0,
        y: 0
      };
      background = new kin.Rect({
        name: 'background for minimap-layer',
        draggable: true,
        listening: true,
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        stroke: attributes.stroke,
        fill: 'white',
        opacity: 0.5,
        dragBoundFunc: function() {
          return zeroOffset;
        }
      });
      layer.getTargetLayer = function() {
        var targetComponent;
        if (targetLayer) {
          return targetLayer;
        }
        targetComponent = controller.findComponent(attributes['target_layer'])[0];
        if (!targetComponent) {
          return null;
        }
        targetLayer = controller.getAttachedViews(targetComponent)[0];
        if (targetLayer) {
          targetComponent.addDisposer(function() {
            return targetLayer = null;
          });
        }
        return targetLayer;
      };
      layer.getBackground = function() {
        return background;
      };
      layer.add(background);
      return layer;
    };
    _mousePointOnEvent = function(layer, e) {
      var scale;
      scale = layer.getStage().scale();
      return {
        x: Math.round(e.offsetX / scale.x),
        y: Math.round(e.offsetY / scale.y)
      };
    };
    onresize = function(e) {
      var background, layer;
      layer = this.listener;
      background = layer.getBackground();
      background.setSize(e.after);
      return layer.batchDraw();
    };
    ondragstart = function(e) {
      var layer, targetLayer;
      layer = this.listener;
      targetLayer = layer.getTargetLayer();
      if (!targetLayer) {
        return;
      }
      this.targetLayerOffsetOnStart = targetLayer.offset();
      this.mousePointOnStart = _mousePointOnEvent(layer, e);
      return e.cancelBubble = true;
    };
    ondragmove = function(e) {
      var controller, layer, mousePointCurrent, moveDelta, targetLayer;
      controller = this.context;
      layer = this.listener;
      targetLayer = layer.getTargetLayer();
      if (!targetLayer) {
        return;
      }
      mousePointCurrent = _mousePointOnEvent(layer, e);
      moveDelta = {
        x: mousePointCurrent.x - this.mousePointOnStart.x,
        y: mousePointCurrent.y - this.mousePointOnStart.y
      };
      controller.offset({
        x: this.targetLayerOffsetOnStart.x - moveDelta.x,
        y: this.targetLayerOffsetOnStart.y - moveDelta.y
      });
      layer.batchDraw();
      return e.cancelBubble = true;
    };
    ondragend = function(e) {
      var layer;
      layer = this.listener;
      layer.offset({
        x: 0,
        y: 0
      });
      layer.batchDraw();
      return e.cancelBubble = true;
    };
    onchange = function(component, before, after) {
      var node;
      node = component.getViews()[0];
      node.setAttrs(after);
      return node.getLayer().batchDraw();
    };
    model_event_map = {
      '(self)': {
        '(self)': {
          change: onchange
        }
      }
    };
    view_event_map = {
      '(self)': {
        dragstart: ondragstart,
        dragmove: ondragmove,
        dragend: ondragend
      },
      '(root)': {
        resize: onresize
      }
    };
    return {
      type: 'minimap-layer',
      name: 'minimap-layer',
      containable: true,
      container_type: 'layer',
      description: 'Minimap Layer Specification',
      defaults: {
        visible: false,
        listening: true
      },
      model_event_map: model_event_map,
      view_event_map: view_event_map,
      view_factory_fn: view_factory,
      toolbox_image: 'images/toolbox_minimap_layer.png',
      exportable: function(appcontext, layer) {
        appcontext.showMinimap = function() {
          return layer.set('visible', true);
        };
        return appcontext.hideMinimap = function() {
          return layer.set('visible', false);
        };
      }
    };
  });

}).call(this);
