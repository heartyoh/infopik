(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var controller, createView, guide_handler, onadded, onchange, onchangemodel, onremoved, view_listener;
    createView = function(attributes) {
      var layer;
      layer = new kin.Layer(attributes);
      layer.add(new kin.Text({
        x: 10,
        y: 10,
        listening: false,
        fontSize: 12,
        fontFamily: 'Calibri',
        fill: 'green'
      }));
      return layer;
    };
    onchange = function(component, before, after) {
      var layer, msg, self, text;
      self = this;
      self.changes++;
      layer = this.layer;
      text = this.text;
      msg = "[ PropertyChange ] " + component.type + " : " + (component.get('id')) + "\n[ Before ] " + (JSON.stringify(before)) + "\n[ After ] " + (JSON.stringify(after));
      text.setAttr('text', msg);
      layer.draw();
      return setTimeout(function() {
        if ((--self.changes) > 0) {
          return;
        }
        text.setAttr('text', '');
        return layer.draw();
      }, 5000);
    };
    onchangemodel = function(after, before) {
      var appcontext, layer, screen, text, _i, _len, _ref, _results;
      appcontext = this;
      _ref = this.findComponent('guide-layer');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        screen = _ref[_i];
        layer = (appcontext.findViewByComponent(screen))[0];
        text = layer.find('Text').toArray()[0];
        if (before) {
          before.off('change', onchange);
        }
        if (after) {
          _results.push(after.on('change', onchange, {
            layer: layer,
            text: text,
            changes: 0
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    guide_handler = {
      dragstart: function(e) {
        var layer, pos, x, y;
        pos = e.targetNode.getAbsolutePosition();
        layer = this.layer;
        x = pos.x;
        y = pos.y;
        this.vert = new kin.Line({
          stroke: 'red',
          tension: 1,
          points: [x, 0, x, 1000]
        });
        this.hori = new kin.Line({
          stroke: 'red',
          tension: 1,
          points: [0, y, 1000, y]
        });
        layer.add(this.vert);
        layer.add(this.hori);
        return layer.draw();
      },
      dragmove: function(e) {
        var layer, pos, x, y;
        pos = e.targetNode.getAbsolutePosition();
        x = pos.x;
        y = pos.y;
        layer = this.layer;
        this.vert.setAttrs({
          points: [x, 0, x, 1000]
        });
        this.hori.setAttrs({
          points: [0, y, 1000, y]
        });
        return layer.draw();
      },
      dragend: function(e) {
        var layer;
        layer = this.layer;
        this.vert.remove();
        this.hori.remove();
        return layer.draw();
      }
    };
    onadded = function(container, component, index, e) {
      var layer, topview;
      topview = this.getView();
      layer = this.findView("\#" + (component.get('id')));
      return this.getEventTracker().on(topview, guide_handler, {
        app: this,
        layer: layer[0]
      });
    };
    onremoved = function(container, component, e) {
      var app;
      app = this.getView();
      return this.getEventHandler().off(app, guide_handler);
    };
    controller = {
      '#application': {
        'change-model': onchangemodel
      },
      'guide-layer': {
        'added': onadded,
        'removed': onremoved
      }
    };
    view_listener = {
      dragmove: function(e) {
        var node;
        return node = e.targetNode;
      }
    };
    return {
      type: 'guide-layer',
      name: 'guide-layer',
      containable: true,
      container_type: 'layer',
      description: 'Editing Guide Specification',
      defaults: {
        draggable: false
      },
      controller: controller,
      view_listener: view_listener,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_guide_layer.png'
    };
  });

}).call(this);
