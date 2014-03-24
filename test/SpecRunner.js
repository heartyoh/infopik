require.config({
  baseUrl: '..',
  paths: {
    'mocha'         : 'bower_components/mocha/mocha',
    'chai'          : 'bower_components/chai/chai',
    'dou'           : 'bower_components/dou/dou',
    'bwip'          : 'bower_components/bwip/bwip',
    'KineticJS'     : 'bower_components/KineticJS/kinetic.min'
  },
  shim: {
    dou: {
      exports: 'dou'
    },
    KineticJS: {
      exports: 'Kinetic'
    },
    bwip: {
      exports: 'bwip'
    },
    mocha: {
      exports: 'mocha'
    }
  },
  urlArgs: 'bust=' + (new Date()).getTime()
});
 
require(['require', 'chai', 'mocha'], function(require, chai){
 
  this.assert = chai.assert;
  this.expect = chai.expect;
  var should = chai.should();

  mocha.setup('bdd');
 
  require([
    'infographic/sample_01.js',
    // 'application_context_spec.js',
    // 'application_context/spec_application.js',
    // 'command_manager_spec.js',
    // 'component_factory_spec.js',
    // 'component_registry_spec.js',
    // 'component_selector_spec.js',
    // 'component_spec.js',
    // 'container_spec.js',
    // 'dou_spec.js',
    // 'event_controller_spec.js',
    // 'event_tracker_spec.js',
    // 'event_tracker_standalone_spec.js',
    // 'selection_manager_spec.js',
    // 'spec_group_spec.js',
    'spec_painter_spec.js',
    'spec_ruler_layer_spec.js',
    'application_size_spec.js',
    // 'spec_presenter_spec.js',
    // 'spec_rect_spec.js',
  ].map(function(test) {
    return 'spec/' + test;
  }), function(require) {
    mocha.run();
  });
 
});