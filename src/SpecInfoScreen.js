(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var controller, createView, onchange, onchangemodel;
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
      var layer, screen, text, _i, _len, _ref, _results;
      _ref = this.findComponent('info-screen');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        screen = _ref[_i];
        layer = (this.findViewByComponent(screen))[0];
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
    controller = {
      '#application': {
        'change-model': onchangemodel
      }
    };
    return {
      type: 'info-screen',
      name: 'info-screen',
      containable: true,
      container_type: 'layer',
      description: 'Information Screen Specification',
      defaults: {
        draggable: false
      },
      controller: controller,
      view_factory_fn: createView,
      toolbox_image: 'images/toolbox_info_screen.png'
    };
  });

}).call(this);
