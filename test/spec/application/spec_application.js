"use strict"

define([
  'KineticJS',
  'src/SpecContentLayer',
  'src/SpecGroup',
  'src/SpecRect'
], function(
  kin,
  SpecContentLayer,
  SpecGroup,
  SpecRect
) {

  var createView = function(attributes) {
    return new kin.Stage(attributes);
  };

  var controller = {
    '#application': {
      'change-model' : function(after, before, e) {
      }
    },
    'sample-app': {
      'add' : function(container, component, index, e) {
      },
      'remove' : function(container, component, e) {
      }
    }
  };

  return {
    type: 'sample-app',
    name: 'sample-app',
    containable: true,
    container_type: 'application',
    description: 'Sample Application Specification',
    defaults: {
    },
    controller: controller,
    view_factory_fn: createView,
    dependencies: {
      'content-layer' : SpecContentLayer,
      'group' : SpecGroup,
      'rect' : SpecRect
    },
    layers : {
      'content-layer' : {}
    },
    toolbox_image: 'images/toolbox_sample_app.png'
  };
});