(function() {
  define(['KineticJS'], function(kin) {
    "use strict";
    var controller, createHandle, createView, view_listener;
    createView = function(attributes) {
      var image, imageObj;
      image = new kin.Image(attributes);
      imageObj = new Image();
      image.setImage(imageObj);
      imageObj.onload = function() {
        return image.draw();
      };
      imageObj.src = attributes['url'];
      return image;
    };
    createHandle = function(attributes) {
      return new Kin.Image(attributes);
    };
    controller = {
      '(self)': {
        '(self)': {
          change: function(component, before, after) {
            var imageObj;
            if (!(before['url'] || after['url'])) {
              return;
            }
            imageObj = component.attaches()[0].getImage();
            return imageObj.src = after['url'];
          }
        }
      }
    };
    view_listener = {
      '(self)': {
        click: function(e) {
          this.count = this.count ? ++this.count : 1;
          if (this.count % 2) {
            return this.listener.__component__.set('url', 'http://i.cdn.turner.com/cnn/.e/img/3.0/global/header/intl/CNNi_Logo.png');
          } else {
            return this.listener.__component__.set('url', 'http://www.baidu.com/img/bdlogo.gif');
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
      controller: controller,
      view_listener: view_listener,
      view_factory_fn: createView,
      handle_factory_fn: createHandle,
      toolbox_image: 'images/toolbox_image.png'
    };
  });

}).call(this);
