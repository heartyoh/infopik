(function() {
  define(['KineticJS', './SpecInfographic', './SpecContentEditLayer', './SpecGroup', './SpecRect'], function(kin, SpecInfographic, SpecContentEditLayer, SpecGroup, SpecRect) {
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
        'group': SpecGroup,
        'rect': SpecRect
      },
      components: [
        {
          type: 'content-edit-layer',
          attrs: {}
        }
      ],
      toolbox_image: 'images/toolbox_painter_app.png'
    };
  });

}).call(this);
