(function() {
  define(['KineticJS', './EventTracker', './CommandPropertyChange', './ComponentSelector'], function(kin, EventTracker, CommandPropertyChange, ComponentSelector) {
    "use strict";
    var component_listener, controller, createView, draghandler, onadded, onchange, onchangemodel, onremoved, view_listener;
    draghandler = {
      dragstart: function(e) {
        return console.log(e);
      },
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
                x: node.getAttr('x'),
                y: node.getAttr('y')
              }
            }
          ]
        });
        return this.execute(cmd);
      }
    };
    createView = function(attributes) {
      return new kin.Layer(attributes);
    };
    onadded = function(container, component, index, e) {};
    onremoved = function(container, component, e) {};
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
    onchange = function(component, before, after) {
      var view;
      view = this.findViewByComponent(component);
      view.setAttrs(after);
      return this.drawView();
    };
    controller = {
      '#application': {
        'change-model': onchangemodel
      },
      'content-layer': {
        'added': onadded,
        'removed': onremoved,
        'change': onchange
      }
    };
    component_listener = {
      'change': onchange
    };
    view_listener = draghandler;
    return {
      type: 'content-layer',
      name: 'content-layer',
      containable: true,
      container_type: 'layer',
      description: 'Content Layer Specification',
      defaults: {},
      controller: controller,
      component_listener: component_listener,
      view_listener: view_listener,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_content_layer.png'
    };
  });

}).call(this);
