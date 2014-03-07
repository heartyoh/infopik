(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var controller, createView, onadd, onchangemodel, onremove;
    createView = function(attributes) {
      return new kin.Layer(attributes);
    };
    onadd = function(container, component, index, e) {};
    onremove = function(container, component, e) {};
    onchangemodel = function(after, before) {
      var layer, _i, _len, _ref, _results;
      _ref = this.findComponent('content-layer');
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
    controller = {
      '#application': {
        'change-model': onchangemodel
      },
      'content-layer': {
        'add': onadd,
        'remove': onremove
      }
    };
    return {
      type: 'content-layer',
      name: 'content-layer',
      containable: true,
      container_type: 'layer',
      description: 'Content Layer Specification',
      defaults: {},
      controller: controller,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_content_layer.png'
    };
  });

}).call(this);
