(function() {
  define(['KineticJS', './SpecInfographic', './SpecContentEditLayer', './SpecGuideLayer', './SpecRulerLayer', './SpecHandleLayer', './SpecMinimapLayer', './SpecGroup', './SpecRect', './SpecCircle', './SpecRing', './SpecRuler', './SpecImage', './SpecText', './SpecStar', './SpecBarcode', '../handle/HandleChecker', '../handle/HandleRect'], function(kin, SpecInfographic, SpecContentEditLayer, SpecGuideLayer, SpecRulerLayer, SpecHandleLayer, SpecMinimapLayer, SpecGroup, SpecRect, SpecCircle, SpecRing, SpecRuler, SpecImage, SpecText, SpecStar, SpecBarcode, HandleChecker, HandleRect) {
    "use strict";
    var createView;
    createView = function(attributes) {
      return new kin.Stage(attributes);
    };
    return {
      type: 'painter-app',
      name: 'painter-app',
      containable: true,
      container_type: 'application',
      description: 'Painter Application Specification',
      defaults: {},
      view_factory_fn: createView,
      dependencies: {
        'infographic': SpecInfographic,
        'content-edit-layer': SpecContentEditLayer,
        'guide-layer': SpecGuideLayer,
        'ruler-layer': SpecRulerLayer,
        'handle-layer': SpecHandleLayer,
        'minimap-layer': SpecMinimapLayer,
        'group': SpecGroup,
        'rect': SpecRect,
        'circle': SpecCircle,
        'ring': SpecRing,
        'ruler': SpecRuler,
        'image': SpecImage,
        'text': SpecText,
        'star': SpecStar,
        'barcode': SpecBarcode,
        'handle-checker': HandleChecker,
        'handle-rect': HandleRect
      },
      layers: [
        {
          type: 'content-edit-layer',
          attrs: {
            offset: {
              x: -20,
              y: -20
            }
          }
        }, {
          type: 'handle-layer',
          attrs: {
            offset_monitor_target: 'content-edit-layer',
            offset: {
              x: -20,
              y: -20
            }
          }
        }, {
          type: 'guide-layer',
          attrs: {
            'target_layer': 'content-edit-layer',
            offset: {
              x: -20,
              y: -20
            }
          }
        }, {
          type: 'ruler-layer',
          attrs: {
            offset_monitor_target: 'content-edit-layer'
          }
        }, {
          type: 'minimap-layer',
          attrs: {
            target_layer: 'content-edit-layer'
          }
        }
      ],
      toolbox_image: 'images/toolbox_painter_app.png'
    };
  });

}).call(this);
