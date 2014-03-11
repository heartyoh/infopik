(function() {
  define(['KineticJS', './SpecInfographic', './SpecContentEditLayer', './SpecInfoScreen', './SpecGroup', './SpecRect', './SpecRing'], function(kin, SpecInfographic, SpecContentEditLayer, SpecInfoScreen, SpecGroup, SpecRect, SpecRing) {
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
        'info-screen': SpecInfoScreen,
        'group': SpecGroup,
        'rect': SpecRect,
        'ring': SpecRing
      },
      components: [
        {
          type: 'content-edit-layer',
          attrs: {}
        }, {
          type: 'info-screen',
          attrs: {}
        }
      ],
      toolbox_image: 'images/toolbox_painter_app.png'
    };
  });

}).call(this);
