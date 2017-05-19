module.exports = function(grunt) {
  'use strict';

  // These plugins provide necessary tasks
  require('load-grunt-tasks')(grunt);
  
  // Project configuration
  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration
    
    watch: {
      css: {
        files: 'sass/**/*.scss',
        tasks: ['sass', 'postcss']
      },
      html: {
        files: 'template/**/*.html',
        tasks: ['includes']
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
          sourcemap: "none"
        },
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.scss'],
          dest: 'css',
          ext: '.css'
        }]
      }
    },

    postcss: {
      options: {
        map: false, // inline sourcemaps
        processors: [
          require('autoprefixer')({browsers: ['last 4 version', 'ie 8', 'ie 9']}), // add vendor prefixes
        ]
      },
      dist: {
        src: 'css/*.css'
      }
    },

    includes: {
      files: {
        src: ['template/*.html'], // Source files
        dest: '', // Destination directory
        flatten: true,
        cwd: '',
        options: {
          silent: true
        }
      }
    },

    concat: {
      generated: {
        files: [
          {
            dest: 'js/scripts.concat.js',
            src: [
              'js/polyfills.js',
              'js/cookies.js',
              'js/scripts.js'
              //'js/svg4everybody.min.js'
            ]
          }
        ]
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      generated: {
        
        files: [
          {
            dest: 'js/scripts.min.js',
            src: ['js/scripts.concat.js']
          }
        ]
      }
    },

    svgstore: {
      options: {
        includedemo: true
      },
      default : {
        files: {
          'img/sprites.svg': ['_wip/svg-sprites/*.svg'],
        },
      }
    },

    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['*.html'], dest: '/volumes/clienti/magnetimarelli/laptimeclub/', filter: 'isFile'},

          // includes files within path and its sub-directories
          {expand: true, src: ['css/**'], dest: '/volumes/clienti/magnetimarelli/laptimeclub/'},
          {expand: true, src: ['img/**'], dest: '/volumes/clienti/magnetimarelli/laptimeclub/'},
          {expand: true, src: ['js/**'],  dest: '/volumes/clienti/magnetimarelli/laptimeclub/'}
        ],
      },
    }

  });

  // Default task
  grunt.registerTask('default', ['sass', 'postcss']);
  grunt.registerTask('mini', ['concat', 'uglify']);
};
