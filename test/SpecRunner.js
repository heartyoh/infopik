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
    'spec/dou_spec.js',
    'spec/command_manager_spec.js',
    'spec/containable_spec.js',
    'spec/container_spec.js',
    'spec/component_spec.js',
    'spec/event_tracker_spec.js',
    'spec/painter_spec.js',
    'spec/presenter_spec.js',
    // 'spec/test-emitter.js',
    // 'spec/test-propertyholder.js'
  ], function(require) {
    mocha.run();
  });
 
});