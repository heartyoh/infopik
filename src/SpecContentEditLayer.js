(function() {
  define(['dou', 'KineticJS', './EventTracker', './CommandPropertyChange', './ComponentSelector'], function(dou, kin, EventTracker, CommandPropertyChange, ComponentSelector) {
    "use strict";
    var component_listener, controller, createView, draghandler, onadded, onchange, onchangemodel, onchangeselections, onremoved, view_listener;
    draghandler = {
      dragstart: function(e) {
        var background, layer_offset, offset;
        if (e.targetNode && e.targetNode !== this.background) {
          return;
        }
        background = this.background;
        background.setAttrs({
          x: 0,
          y: 0
        });
        this.start_point = {
          x: e.offsetX,
          y: e.offsetY
        };
        layer_offset = this.layer.offset();
        offset = {
          x: this.start_point.x + layer_offset.x,
          y: this.start_point.y + layer_offset.y
        };
        this.selectbox = new kin.Rect({
          stroke: 'black',
          strokeWidth: 1,
          dash: [3, 3]
        });
        this.layer.add(this.selectbox);
        this.selectbox.setAttrs(offset);
        this.layer.draw();
        return e.cancelBubble = true;
      },
      dragmove: function(e) {
        var background;
        if (e.targetNode && e.targetNode !== this.background) {
          return;
        }
        background = this.background;
        background.setAttrs({
          x: 0,
          y: 0
        });
        this.selectbox.setAttrs({
          width: e.offsetX - this.start_point.x,
          height: e.offsetY - this.start_point.y
        });
        this.layer.draw();
        return e.cancelBubble = true;
      },
      dragend: function(e) {
        var background;
        if (e.targetNode && e.targetNode !== this.background) {
          return;
        }
        background = this.background;
        background.setAttrs({
          x: 0,
          y: 0
        });
        this.selectbox.remove();
        delete this.selectbox;
        this.layer.draw();
        return e.cancelBubble = true;
      }
    };
    createView = function(attributes) {
      var background, layer;
      layer = new kin.Layer(attributes);
      background = new kin.Rect({
        draggable: true,
        listening: true,
        x: 0,
        y: 0,
        width: 1000,
        height: 1000,
        stroke: attributes.stroke
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
