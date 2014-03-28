(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var model_event_map, onchange, ondragend, ondragmove, ondragstart, onresize, view_event_map, view_factory, _mousePointOnEvent, _stuckHandleOnCenter;
    view_factory = function(attributes) {
      var background, controller, handle, layer, scale, stage, targetLayer, zeroOffset;
      stage = this.getView().getStage();
      layer = new kin.Layer(attributes);
      controller = this;
      targetLayer = null;
      scale = stage.scale();
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
        opacity: 0,
        dragBoundFunc: function() {
          return zeroOffset;
        }
      });
      handle = new kin.Circle({
        name: 'handle for minimap-layer',
        draggable: true,
        listening: true,
        x: stage.width() / scale.x / 2,
        y: stage.height() / scale.y / 2,
        radius: 50,
        stroke: 'red',
        fill: 'red',
        opacity: 0.5
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
      layer.getHandle = function() {
        return handle;
      };
      layer.add(background);
      layer.add(handle);
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
    _stuckHandleOnCenter = function(layer) {
      var handle, scale, stage;
      stage = layer.getStage();
      scale = stage.scale();
      handle = layer.getHandle();
      return handle.position({
        x: stage.width() / scale.x / 2,
        y: stage.height() / scale.y / 2
      });
    };
    onresize = function(e) {
      var background, layer, scale, stage;
      layer = this.listener;
      stage = layer.getStage();
      scale = stage.scale();
      background = layer.getBackground();
      background.setSize(e.after);
      _stuckHandleOnCenter(layer);
      return layer.batchDraw();
    };
    ondragstart = function(e) {
      var controller, handle, handleInitialPosition, layer, targetLayer;
      controller = this.context;
      e.cancelBubble = true;
      layer = this.listener;
      targetLayer = layer.getTargetLayer();
      if (!targetLayer) {
        return;
      }
      handle = layer.getHandle();
      if (e.targetNode === handle) {
        handleInitialPosition = handle.position();
        return this.interval = setInterval((function(_this) {
          return function() {
            var handleCurrentPosition, moveDelta, targetCurrentOffset;
            handleCurrentPosition = handle.position();
            moveDelta = {
              x: handleCurrentPosition.x - handleInitialPosition.x,
              y: handleCurrentPosition.y - handleInitialPosition.y
            };
            targetCurrentOffset = targetLayer.offset();
            return controller.offset({
              x: targetCurrentOffset.x + moveDelta.x / 5,
              y: targetCurrentOffset.y + moveDelta.y / 5
            });
          };
        })(this), 100);
      } else {
        this.targetLayerOffsetOnStart = targetLayer.offset();
        return this.mousePointOnStart = _mousePointOnEvent(layer, e);
      }
    };
    ondragmove = function(e) {
      var controller, layer, mousePointCurrent, moveDelta, targetLayer;
      e.cancelBubble = true;
      controller = this.context;
      layer = this.listener;
      targetLayer = layer.getTargetLayer();
      if (!targetLayer || e.targetNode === layer.getHandle()) {
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
      return layer.batchDraw();
    };
    ondragend = function(e) {
      var layer;
      e.cancelBubble = true;
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      layer = this.listener;
      layer.offset({
        x: 0,
        y: 0
      });
      _stuckHandleOnCenter(layer);
      return layer.batchDraw();
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
