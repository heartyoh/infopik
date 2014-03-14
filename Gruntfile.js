'use strict';

module.exports = function (grunt) {

  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    coffee: {
      build: {
        options: {
          bare: false,
          join: false,
          sourceMap: false
        },
        expand: true,
        cwd: 'src',
        src: '**/*.coffee',
        dest: 'build',
        ext: '.js'
      }
    },
    execute: {
      standalone: {
        src: 'tools/standalone/build.js'
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      }, 
      build: {
        src: ['build/**/*.js'],
        dest: 'infopik.js'
      }
    },
    uglify: {
      build: {
        src: 'infopik.js',
        dest: 'infopik-min.js'
      }
    },
    copy: {
      rails: {
        files: [
          {
            expand: true,
            cwd: '.',
            src: ['infopik.js', 'infopik-min.js'],
            dest: 'vendor/assets/javascripts/',
            filter: 'isFile'
          }
        ]
      }
    },
    jsbeautifier: {
        files: ["src/**/*.js"],
        options: {
        }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['src/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      coffee: {
        files: '<%= coffee.build.src %>',
        tasks: ['coffee:build']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'nodeunit']
      // },
      // test: {
      //   files: '<%= jshint.test.src %>',
      //   tasks: ['jshint:test', 'nodeunit']
      }
    },
    mocha: {
      test: {
        src: ['test/**/*.html'],
        options: {
          run: true,
        }
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'], //['package.json', 'bower.json'], // '-a' for all files
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    },
    replace: {
      'bump-gem': {
        src: ['lib/infopik/version.rb'],
        overwrite: true, // overwrite matched source files
        replacements: [{
          from: /VERSION = \"\S*\"/,
          to: "VERSION = \"<%= pkg.version %>\""
        }]
      }
    },
    changelog: {
      options: {
      }
    },
    exec: {
      build_gem: {
        command: "gem build infopik.gemspec"
      },
      push_gem: {
        command: "gem push infopik-rails-<%= pkg.version %>.gem"
      },
      publish_npm: {
        command: "npm publish"
      }
    },
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5, // maximum number of notifications from jshint output
        title: "Project Name" // defaults to the name in package.json, or will use project directory's name
      }
    }
  });

  grunt.registerTask('bumpup', ['bump-only', 'replace:bump-gem']);
  // grunt.registerTask('build', ['coffee:build', 'concat:build', 'uglify:build', 'copy:rails']);
  grunt.registerTask('build', ['coffee:build', 'execute:standalone', 'copy:rails']);
  grunt.registerTask('release', ['bumpup', 'build', 'exec:build_gem', 'exec:push_gem', 'exec:publish_npm']);

  // Default task.
  grunt.registerTask('default', ['build']);

};
