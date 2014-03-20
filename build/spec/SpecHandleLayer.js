(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var controller, createView, onchangeoffset, onchangeselection, ondragend, ondragmove, view_listener;
    createView = function(attributes) {
      var layer;
      layer = new kin.Layer(attributes);
      layer.handles = {};
      return layer;
    };
    onchangeoffset = function(e) {
      var layer;
      layer = this.listener;
      layer.offset({
        x: e.x,
        y: e.y
      });
      return layer.batchDraw();
    };
    ondragmove = function(e) {
      var handle, id, layer;
      layer = this.listener;
      id = e.targetNode.getAttr('id');
      handle = layer.handles[id];
      if (handle) {
        handle.setAbsolutePosition(e.targetNode.getAbsolutePosition());
        return layer.batchDraw();
      }
    };
    ondragend = function(e) {
      var handle, id, layer;
      layer = this.listener;
      id = e.targetNode.getAttr('id');
      handle = layer.handles[id];
      if (handle) {
        handle.setAbsolutePosition(e.targetNode.getAbsolutePosition());
        return layer.draw();
      }
    };
    onchangeselection = function(after, before, added, removed, e) {
      var container, handle, handle_comp, handle_view, id, layer, node, pos, _i, _j, _len, _len1;
      container = e.listener;
      layer = container.getViews()[0];
      for (_i = 0, _len = removed.length; _i < _len; _i++) {
        node = removed[_i];
        id = node.getAttr('id');
        handle = layer.handles[id];
        handle_comp = handle.getModel();
        container.remove(handle_comp);
        delete layer.handles[id];
      }
      for (_j = 0, _len1 = added.length; _j < _len1; _j++) {
        node = added[_j];
        id = node.getAttr('id');
        pos = node.getAbsolutePosition();
        handle_comp = this.createComponent({
          type: 'handle-checker',
          attrs: {}
        });
        container.add(handle_comp);
        handle_view = handle_comp.getViews()[0];
        handle_view.setAbsolutePosition(pos);
        layer.handles[id] = handle_view;
      }
      return layer.batchDraw();
    };
    controller = {
      '(root)': {
        '(root)': {
          'change-selections': onchangeselection
        }
      }
    };
    view_listener = {
      '?offset_monitor_target': {
        'change-offset': onchangeoffset,
        dragmove: ondragmove,
        dragend: ondragend
      }
    };
    return {
      type: 'handle-layer',
      name: 'handle-layer',
      containable: true,
      container_type: 'layer',
      description: 'Handle Layer Specification',
      defaults: {
        draggable: false
      },
      controller: controller,
      view_listener: view_listener,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_handle_layer.png'
    };
  });

}).call(this);
