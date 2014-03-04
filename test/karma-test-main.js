var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return (/_spec\.js$/.test(file));
});

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    // ask Require.js to load these files (all our tests)
    deps: tests,

	paths: {
		'dou'           : 'bower_components/dou/dou',
		'bwip'          : 'bower_components/bwip/bwip',
		'KineticJS'     : 'bower_components/KineticJS/kinetic'
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

    // start test run, once Require.js is done
    callback: window.__karma__.start
});

