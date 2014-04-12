(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var createView, model_event_map, onchangeoffset, onchangeselection, ondragend, ondragmove, view_event_map;
    createView = function(attributes) {
      var view;
      view = new kin.Layer(attributes);
      view.handles = {};
      return view;
    };
    onchangeoffset = function(e) {
      var view;
      view = this.listener;
      view.offset({
        x: e.x,
        y: e.y
      });
      return view.batchDraw();
    };
    ondragmove = function(e) {
      var handle, id, view;
      view = this.listener;
      id = e.targetNode.getAttr('id');
      handle = view.handles[id];
      if (handle) {
        handle.setAbsolutePosition(e.targetNode.getAbsolutePosition());
        return view.batchDraw();
      }
    };
    ondragend = function(e) {
      var handle, id, view;
      view = this.listener;
      id = e.targetNode.getAttr('id');
      handle = view.handles[id];
      if (handle) {
        handle.setAbsolutePosition(e.targetNode.getAbsolutePosition());
        return view.draw();
      }
    };
    onchangeselection = function(after, before, added, removed, e) {
      var controller, handle, handle_comp, handle_view, id, model, node, pos, view, _i, _j, _len, _len1;
      controller = this;
      model = e.listener;
      view = controller.getAttachedViews(model)[0];
      for (_i = 0, _len = removed.length; _i < _len; _i++) {
        node = removed[_i];
        id = node.getAttr('id');
        handle = view.handles[id];
        handle_comp = controller.getAttachedModel(handle);
        model.remove(handle_comp);
        delete view.handles[id];
      }
      for (_j = 0, _len1 = added.length; _j < _len1; _j++) {
        node = added[_j];
        id = node.getAttr('id');
        pos = node.getAbsolutePosition();
        handle_comp = this.createComponent({
          type: 'handle-rect',
          attrs: {}
        });
        model.add(handle_comp);
        handle_view = controller.getAttachedViews(handle_comp)[0];
        handle_view.setTarget(node);
        view.handles[id] = handle_view;
      }
      return view.batchDraw();
    };
    model_event_map = {
      '(root)': {
        '(root)': {
          'change-selections': onchangeselection
        }
      }
    };
    view_event_map = {
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
      model_event_map: model_event_map,
      view_event_map: view_event_map,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_handle_layer.png'
    };
  });

}).call(this);
