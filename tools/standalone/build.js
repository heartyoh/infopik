var builder = require('loadbuilder'),
    uglify  = require('uglify-js'),
    version = require('../../package.json').version,
    path    = require('path'),
    fs      = require('fs');

var rootPath           = path.join(__dirname, '..', '..'),
    shimPath           = path.join(__dirname, 'amd-shim.js'),
    bannerPath         = path.join(__dirname, 'banner.txt'),
    buildDir           = path.join(__dirname, '..', '..'),
    infopikPath         = path.join(buildDir, 'infopik.js'),
    infopikPathMin      = path.join(buildDir, 'infopik-min.js'),
    modulePlaceholder  = '{{ module }}',
    versionPlaceholder = '{{ version }}';

var infopikSource = builder({
  docRoot: rootPath,
  path: '.',
  excludes: ['dou', 'KineticJS', 'bwip']
}).include('build/infopik').toSource();

var amdShim = fs.readFileSync(shimPath, 'utf8');
var banner = fs.readFileSync(bannerPath, 'utf8').split(versionPlaceholder).join(version);
var bundle = amdShim.split(modulePlaceholder).join(infopikSource);
var bundleMin = uglify.minify(bundle, {fromString: true}).code;

// prepend the version / licence banner to the files
bundle = [banner, bundle].join('');
bundleMin = [banner, bundleMin].join('');

fs.writeFileSync(infopikPath, bundle, 'utf8');
fs.writeFileSync(infopikPathMin, bundleMin, 'utf8');