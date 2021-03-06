(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var model_event_map, onadded, onchange, ondragend, ondragmove, ondragstart, onremoved, view_event_map, view_factory, _nodeTracker;
    view_factory = function(attributes) {
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
    _nodeTracker = function(guideLayer, node) {
      var guideLayerOffset, nodeAbsPosition, nodeLayerOffset, scale;
      guideLayerOffset = guideLayer.offset();
      nodeLayerOffset = node.getLayer().offset();
      nodeAbsPosition = node.getAbsolutePosition();
      scale = node.getStage().scale();
      return {
        x: nodeAbsPosition.x / scale.x + guideLayerOffset.x,
        y: nodeAbsPosition.y / scale.y + guideLayerOffset.y
      };
    };
    ondragstart = function(e) {
      var guidePosition, layer, node, stage;
      layer = this.listener;
      node = e.targetNode;
      stage = layer.getStage();
      this.scale = stage.getScale();
      this.width = stage.getWidth();
      this.height = stage.getHeight();
      guidePosition = _nodeTracker(layer, node);
      this.vert = new kin.Line({
        stroke: 'red',
        tension: 1,
        points: [guidePosition.x, 0, guidePosition.x, this.height]
      });
      this.hori = new kin.Line({
        stroke: 'red',
        tension: 1,
        points: [0, guidePosition.y, this.width, guidePosition.y]
      });
      this.text = new kin.Text({
        listening: false,
        fontSize: 12,
        fontFamily: 'Calibri',
        fill: 'green'
      });
      this.text.setAttrs({
        text: "[ " + guidePosition.x + "(" + (node.x()) + "), " + guidePosition.y + "(" + (node.y()) + ") ]",
        x: Math.max(guidePosition.x, 0) > (this.text.width() + 10) ? guidePosition.x - (this.text.width() + 10) : Math.max(guidePosition.x + 10, 10),
        y: Math.max(guidePosition.y, 0) > (this.text.height() + 10) ? guidePosition.y - (this.text.height() + 10) : Math.max(guidePosition.y + 10, 10)
      });
      layer.add(this.vert);
      layer.add(this.hori);
      layer.add(this.text);
      return layer.batchDraw();
    };
    ondragmove = function(e) {
      var autoMovingBottom, autoMovingLeft, autoMovingRight, autoMovingTop, controller, guidePosition, layer, node, nodeLayer, nodePositionCurrent, oldOffset, scale, x, y;
      controller = this.context;
      layer = this.listener;
      node = e.targetNode;
      nodePositionCurrent = node.position();
      node.position({
        x: Math.round(nodePositionCurrent.x / 10) * 10,
        y: Math.round(nodePositionCurrent.y / 10) * 10
      });
      guidePosition = _nodeTracker(layer, node);
      this.vert.setAttrs({
        points: [guidePosition.x, 0, guidePosition.x, this.height]
      });
      this.hori.setAttrs({
        points: [0, guidePosition.y, this.width, guidePosition.y]
      });
      this.text.setAttrs({
        text: "[ " + guidePosition.x + "(" + (node.x()) + "), " + guidePosition.y + "(" + (node.y()) + ") ]",
        x: Math.max(guidePosition.x, 0) > (this.text.width() + 10) ? guidePosition.x - (this.text.width() + 10) : Math.max(guidePosition.x + 10, 10),
        y: Math.max(guidePosition.y, 0) > (this.text.height() + 10) ? guidePosition.y - (this.text.height() + 10) : Math.max(guidePosition.y + 10, 10)
      });
      scale = node.getStage().scale();
      autoMovingLeft = (node.getStage().width() + layer.offset().x) / scale.x * 1 / 5;
      autoMovingRight = (node.getStage().width() + layer.offset().x) / scale.x * 4 / 5;
      autoMovingTop = (node.getStage().height() + layer.offset().y) / scale.y * 1 / 5;
      autoMovingBottom = (node.getStage().height() + layer.offset().y) / scale.y * 4 / 5;
      console.log(autoMovingLeft, autoMovingRight, autoMovingTop, autoMovingBottom);
      if (guidePosition.x < autoMovingLeft || guidePosition.x > autoMovingRight || guidePosition.y < autoMovingTop || guidePosition.y > autoMovingBottom) {
        nodeLayer = node.getLayer();
        oldOffset = nodeLayer.offset();
        x = guidePosition.x <= autoMovingLeft ? Math.max(oldOffset.x - 10, -20) : guidePosition.x >= autoMovingRight ? oldOffset.x + 10 : oldOffset.x;
        y = guidePosition.y <= autoMovingTop ? Math.max(oldOffset.y - 10, -20) : guidePosition.y >= autoMovingBottom ? oldOffset.y + 10 : oldOffset.y;
        console.log(guidePosition, x, y);
        if (oldOffset.x !== x || oldOffset.y !== y) {
          controller.offset({
            x: x,
            y: y
          });
        }
      }
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
    onremoved = function(container, component, e) {};
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
      view_factory_fn: view_factory,
      toolbox_image: 'images/toolbox_guide_layer.png'
    };
  });

}).call(this);
