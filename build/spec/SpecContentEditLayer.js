(function() {
  define(['dou', 'KineticJS', '../EventTracker', '../ComponentSelector', '../command/CommandPropertyChange'], function(dou, kin, EventTracker, ComponentSelector, CommandPropertyChange) {
    "use strict";
    var component_listener, controller, createView, draghandler, onadded, onchange, onchangemodel, onchangeselections, onremoved, view_listener;
    draghandler = {
      dragstart: function(e) {
        var background, layer_offset, mode, offset;
        if (e.targetNode && e.targetNode !== this.background) {
          return;
        }
        background = this.background;
        layer_offset = this.layer.offset();
        background.setAttrs({
          x: layer_offset.x + 20,
          y: layer_offset.y + 20
        });
        this.start_point = {
          x: e.offsetX,
          y: e.offsetY
        };
        this.origin_offset = this.layer.offset();
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
          this.layer.add(this.selectbox);
          this.selectbox.setAttrs(offset);
        } else if (mode === 'MOVE') {

        } else {

        }
        this.layer.draw();
        return e.cancelBubble = true;
      },
      dragmove: function(e) {
        var background, mode, x, y;
        if (e.targetNode && e.targetNode !== this.background) {
          return;
        }
        background = this.background;
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
          x = Math.max(this.origin_offset.x - (e.offsetX - this.start_point.x), -20);
          y = Math.max(this.origin_offset.y - (e.offsetY - this.start_point.y), -20);
          this.layer.offset({
            x: x,
            y: y
          });
          this.background.setAttrs({
            x: x + 20,
            y: y + 20
          });
        } else {

        }
        this.layer.draw();
        return e.cancelBubble = true;
      },
      dragend: function(e) {
        var background, mode;
        if (e.targetNode && e.targetNode !== this.background) {
          return;
        }
        background = this.background;
        mode = 'MOVE';
        if (mode === 'SELECT') {
          background.setAttrs({
            x: this.origin_offset.x + 20,
            y: this.origin_offset.y + 20
          });
          this.selectbox.remove();
          delete this.selectbox;
        } else if (mode === 'MOVE') {

        } else {

        }
        this.layer.draw();
        return e.cancelBubble = true;
      }
    };
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
      this.getEventTracker().on(layer, draghandler, {
        layer: layer,
        background: background
      });
      return layer;
    };
    onadded = function(container, component, index, e) {};
    onremoved = function(container, component, e) {};
    onchangemodel = function(after, before) {
      var layer, _i, _len, _ref, _results;
      _ref = this.findComponent('content-edit-layer');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        if (before) {
          layer.remove(before);
        }
        if (after) {
          layer.add(after);
        }
        _results.push(this.findView("\#" + (layer.get('id'))));
      }
      return _results;
    };
    onchangeselections = function(after, before, added, removed) {
      return console.log('selection-changed', after);
    };
    onchange = function(component, before, after) {};
    controller = {
      '#application': {
        'change-model': onchangemodel,
        'change-selections': onchangeselections
      },
      'content-edit-layer': {
        'added': onadded,
        'removed': onremoved,
        'change': onchange
      }
    };
    component_listener = {
      'change': onchange
    };
    view_listener = {
      dragstart: function(e) {},
      dragmove: function(e) {},
      dragend: function(e) {
        var cmd, component, id, node;
        node = e.targetNode;
        id = e.targetNode.getAttr('id');
        component = this.findComponent("\#" + id)[0];
        if (!component) {
          return;
        }
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
        return this.execute(cmd);
      },
      click: function(e) {
        var node;
        node = e.targetNode;
        return this.selectionManager.select(node);
      },
      mouseover: function(e) {},
      mousemove: function(e) {},
      mouseout: function(e) {},
      mouseenter: function(e) {},
      mouseleave: function(e) {}
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
      component_listener: component_listener,
      view_listener: view_listener,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_content_edit_layer.png'
    };
  });

}).call(this);
