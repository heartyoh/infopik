(function() {
  define(['KineticJS', '../EventTracker', '../ComponentSelector', '../command/CommandPropertyChange'], function(kin, EventTracker, ComponentSelector, CommandPropertyChange) {
    "use strict";
    var createView, model_event_map, onadded, onchange, onchangemodel, onremoved, view_event_map;
    createView = function(attributes) {
      return new kin.Layer(attributes);
    };
    onadded = function(container, component, index, e) {};
    onremoved = function(container, component, e) {};
    onchangemodel = function(after, before) {
      var layer, _i, _len, _ref, _results;
      _ref = this.findComponent('content-view-layer');
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
    onchange = function(component, before, after) {
      var view;
      view = this.findViewByComponent(component);
      view.setAttrs(after);
      return this.drawView();
    };
    model_event_map = {
      '(root)': {
        '(root)': {
          'change-model': onchangemodel
        }
      },
      '(self)': {
        '(all)': {
          'change': onchange
        },
        '(self)': {
          'change': onchange
        }
      }
    };
    view_event_map = {
      click: function(e) {
        var node;
        node = e.targetNode;
        return this.selectionManager.select(node);
      }
    };
    return {
      type: 'content-view-layer',
      name: 'content-view-layer',
      containable: true,
      container_type: 'layer',
      description: 'Content View Layer Specification',
      defaults: {},
      model_event_map: model_event_map,
      view_event_map: view_event_map,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_content_view_layer.png'
    };
  });

}).call(this);
