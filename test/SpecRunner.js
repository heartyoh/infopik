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
    'command_manager',
    'component_registry',
    'component',
    'container',
    'dou',
    'event_controller',
    'event_tracker',
    'painter',
    'presenter',
    'spec_group',
    'spec_rect',
  ].map(function(test) {
    return 'spec/' + test + '_spec.js';
  }), function(require) {
    mocha.run();
  });
 
});