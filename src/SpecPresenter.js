(function() {
  define(['KineticJS', './SpecContentLayer', './SpecGroup', './SpecRect'], function(kin, SpecContentLayer, SpecGroup, SpecRect) {
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
        'content-layer': SpecContentLayer,
        'group': SpecGroup,
        'rect': SpecRect
      },
      layers: {
        'content-layer': {}
      },
      toolbox_image: 'images/toolbox_presenter_app.png'
    };
  });

}).call(this);
