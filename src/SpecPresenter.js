(function() {
  define(['KineticJS', './SpecInfographic', './SpecContentViewLayer', './SpecGroup', './SpecRect'], function(kin, SpecInfographic, SpecContentViewLayer, SpecGroup, SpecRect) {
    "use strict";
    var controller, createView;
    createView = function(attributes) {
      return new kin.Stage(attributes);
    };
    return controller = {
      type: 'presenter-app',
      name: 'presenter-app',
      containable: true,
      container_type: 'application',
      description: 'Presenter Application Specification',
      defaults: {},
      controller: controller,
      view_factory_fn: createView,
      dependencies: {
        'infographic': SpecInfographic,
        'content-view-layer': SpecContentViewLayer,
        'group': SpecGroup,
        'rect': SpecRect
      },
      components: [
        {
          type: 'content-view-layer',
          attrs: {}
        }
      ],
      toolbox_image: 'images/toolbox_presenter_app.png'
    };
  });

}).call(this);
