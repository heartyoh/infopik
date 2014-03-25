(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var createHandle, createView, model_event_map, view_event_map;
    createView = function(attributes) {
      var image, imageObj;
      image = new kin.Image(attributes);
      imageObj = new Image();
      imageObj.onload = function() {
        return image.getLayer().draw();
      };
      imageObj.src = attributes['url'];
      image.setImage(imageObj);
      return image;
    };
    createHandle = function(attributes) {
      return new Kin.Image(attributes);
    };
    model_event_map = {
      '(self)': {
        '(self)': {
          change: function(component, before, after) {
            var controller, imageObj, view;
            if (!(before['url'] || after['url'])) {
              return;
            }
            controller = this;
            view = controller.getAttachedViews(component)[0];
            imageObj = view.getImage();
            return imageObj.src = after['url'];
          }
        }
      }
    };
    view_event_map = {
      '(self)': {
        click: function(e) {
          var controller, model, view;
          controller = this.context;
          view = this.listener;
          model = controller.getAttachedModel(view);
          this.count = this.count ? ++this.count : 1;
          if (this.count % 2) {
            return model.set('url', 'http://www.baidu.com/img/bdlogo.gif');
          } else {
            return model.set('url', 'http://i.cdn.turner.com/cnn/.e/img/3.0/global/header/intl/CNNi_Logo.png');
          }
        }
      }
    };
    return {
      type: 'image',
      name: 'image',
      description: 'Image Specification',
      defaults: {
        width: 100,
        height: 50,
        stroke: 'black',
        strokeWidth: 1,
        rotationDeg: 0,
        draggable: true
      },
      model_event_map: model_event_map,
      view_event_map: view_event_map,
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_image.png'
    };
  });

}).call(this);
