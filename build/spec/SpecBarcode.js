(function() {
  define(['bwip', 'KineticJS'], function(bwip, kin) {
    "use strict";
    var createHandle, createView, model_event_map;
    createView = function(attributes) {
      var imageObj, view;
      view = new kin.Image({
        x: attributes.x,
        y: attributes.y,
        draggable: true,
        id: attributes.id
      });
      imageObj = new Image();
      imageObj.onload = function() {
        var layer;
        view.setAttrs({
          width: imageObj.width,
          height: imageObj.height
        });
        layer = view.getLayer();
        if (layer) {
          return layer.draw();
        }
      };
      imageObj.src = bwip.imageUrl({
        symbol: attributes['symbol'],
        text: attributes['text'],
        alttext: attributes['alttext'],
        scale_h: attributes['scale_h'],
        scale_w: attributes['scale_w'],
        rotation: attributes['rotation']
      });
      view.setImage(imageObj);
      return view;
    };
    createHandle = function(attributes) {
      return new Kin.Image(attributes);
    };
    model_event_map = {
      '(self)': {
        '(self)': {
          change: function(component, before, after, changed) {
            var controller, imageObj, url, view;
            if (after.x || after.y) {
              return;
            }
            controller = this;
            view = controller.getAttachedViews()[0];
            url = bwip.imageUrl({
              symbol: component.get('symbol'),
              text: component.get('text'),
              alttext: component.get('alttext'),
              scale_h: component.get('scale_h'),
              scale_w: component.get('scale_w'),
              rotation: component.get('rotation')
            });
            imageObj = view.getImage();
            return imageObj.src = url;
          }
        }
      }
    };
    return {
      type: 'barcode',
      name: 'barcode',
      description: 'Barcode Specification',
      defaults: {
        width: 100,
        height: 50,
        stroke: 'black',
        strokeWidth: 1,
        rotationDeg: 0,
        draggable: true
      },
      model_event_map: model_event_map,
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_barcode.png'
    };
  });

}).call(this);
