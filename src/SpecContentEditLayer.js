(function() {
  define(['KineticJS', './EventTracker', './CommandPropertyChange', './ComponentSelector'], function(kin, EventTracker, CommandPropertyChange, ComponentSelector) {
    "use strict";
    var component_listener, controller, createView, onadded, onchange, onchangemodel, onchangeselections, onremoved, view_listener;
    createView = function(attributes) {
      return new kin.Layer(attributes);
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
    onchange = function(component, before, after) {
      var view;
      view = this.findViewByComponent(component);
      view.setAttrs(after);
      return this.drawView();
    };
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
      },
      click: function(e) {
        var node;
        node = e.targetNode;
        return this.selectionManager.select(node);
      },
      mouseover: function(e) {
        return console.log(e.type, e);
      },
      mousemove: function(e) {},
      mouseout: function(e) {
        return console.log(e.type, e);
      },
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
        draggable: true
      },
      controller: controller,
      component_listener: component_listener,
      view_listener: view_listener,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_content_edit_layer.png'
    };
  });

}).call(this);
