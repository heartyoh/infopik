(function() {
  define(['KineticJS', './SpecInfographic', './SpecContentEditLayer', './SpecGuideLayer', './SpecRulerLayer', './SpecGroup', './SpecRect', './SpecRing', './SpecRuler'], function(kin, SpecInfographic, SpecContentEditLayer, SpecGuideLayer, SpecRulerLayer, SpecGroup, SpecRect, SpecRing, SpecRuler) {
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
        'group': SpecGroup,
        'rect': SpecRect,
        'ring': SpecRing,
        'ruler': SpecRuler
      },
      layers: [
        {
          type: 'content-edit-layer',
          attrs: {}
        }, {
          type: 'guide-layer',
          attrs: {}
        }, {
          type: 'ruler-layer',
          attrs: {}
        }
      ],
      toolbox_image: 'images/toolbox_painter_app.png'
    };
  });

}).call(this);
