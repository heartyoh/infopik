(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var controller, createView, onchangeselection;
    createView = function(attributes) {
      var layer, target_comp, target_view;
      layer = new kin.Layer(attributes);
      layer.handles = {};
      if (attributes.offset_monitor_target) {
        target_comp = this.findComponent(attributes.offset_monitor_target)[0];
        target_view = this.findViewByComponent(target_comp);
        target_view.on('change-offset', function(e) {
          layer.offset({
            x: e.x,
            y: e.y
          });
          return layer.draw();
        });
        this.getEventTracker().on(target_view, {
          dragmove: function(e) {
            var handle, id;
            id = e.targetNode.getAttr('id');
            handle = layer.handles[id];
            if (handle) {
              handle.setAbsolutePosition(e.targetNode.getAbsolutePosition());
              return layer.draw();
            }
          },
          dragend: function(e) {
            var handle, id;
            id = e.targetNode.getAttr('id');
            handle = layer.handles[id];
            if (handle) {
              handle.setAbsolutePosition(e.targetNode.getAbsolutePosition());
              return layer.draw();
            }
          }
        }, {});
      }
      return layer;
    };
    onchangeselection = function(after, before, added, removed, e) {
      var container, handle, handle_comp, handle_view, id, layer, node, pos, _i, _j, _len, _len1;
      container = e.listener;
      layer = this.findViewByComponent(container)[0];
      for (_i = 0, _len = removed.length; _i < _len; _i++) {
        node = removed[_i];
        id = node.getAttr('id');
        handle = layer.handles[id];
        handle_comp = this.findComponent("\#" + (handle.getAttr('id')))[0];
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
        handle_view = this.findViewByComponent(handle_comp)[0];
        handle_view.setAbsolutePosition(pos);
        layer.handles[id] = handle_view;
      }
      return layer.draw();
    };
    controller = {
      '(root)': {
        'change-selections': onchangeselection
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
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_handle_layer.png'
    };
  });

}).call(this);
