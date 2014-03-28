(function() {
  define(['dou', 'KineticJS'], function(dou, kin) {
    "use strict";
    var model_event_map, model_initialize, onadded, onchange, onchangemodel, onremoved, view_event_map, view_factory, _mousePointOnEvent;
    view_factory = function(attributes) {
      return new kin.Layer(attributes);
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
    onchange = function(component, before, after) {
      var node;
      node = component.getViews()[0];
      node.setAttrs(after);
      return node.getLayer().batchDraw();
    };
    _mousePointOnEvent = function(layer, e) {
      var scale;
      scale = layer.getStage().scale();
      return {
        x: Math.round(e.offsetX / scale.x),
        y: Math.round(e.offsetY / scale.y)
      };
    };
    model_event_map = {
      '(root)': {
        '(root)': {
          'change-model': onchangemodel
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
    return view_event_map = {
      type: 'content-view-layer',
      name: 'content-view-layer',
      containable: true,
      container_type: 'layer',
      description: 'Content View Layer Specification',
      defaults: {},
      model_event_map: model_event_map,
      view_event_map: view_event_map,
      model_initialize_fn: model_initialize,
      view_factory_fn: view_factory,
      toolbox_image: 'images/toolbox_content_view_layer.png'
    };
  });

}).call(this);
