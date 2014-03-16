(function() {
  define(['KineticJS', './SpecInfographic', './SpecContentEditLayer', './SpecGuideLayer', './SpecRulerLayer', './SpecHandleLayer', './SpecGroup', './SpecRect', './SpecRing', './SpecRuler', '../handle/HandleChecker'], function(kin, SpecInfographic, SpecContentEditLayer, SpecGuideLayer, SpecRulerLayer, SpecHandleLayer, SpecGroup, SpecRect, SpecRing, SpecRuler, HandleChecker) {
    "use strict";
    var controller, createView;
    createView = function(attributes) {
      return new kin.Stage(attributes);
    };
    return controller = {
      type: 'painter-app',
      name: 'painter-app',
      containable: true,
      container_type: 'application',
      description: 'Painter Application Specification',
      defaults: {},
      controller: controller,
      view_factory_fn: createView,
      dependencies: {
        'infographic': SpecInfographic,
        'content-edit-layer': SpecContentEditLayer,
        'guide-layer': SpecGuideLayer,
        'ruler-layer': SpecRulerLayer,
        'handle-layer': SpecHandleLayer,
        'group': SpecGroup,
        'rect': SpecRect,
        'ring': SpecRing,
        'ruler': SpecRuler,
        'handle-checker': HandleChecker
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
        }
      ],
      toolbox_image: 'images/toolbox_painter_app.png'
    };
  });

}).call(this);
