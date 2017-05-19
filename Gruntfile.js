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

    concat: {
      generated: {
        files: [
          {
            dest: 'js/sipario.concat.js',
            src: [
              'js/sipario.js'
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
            dest: 'js/sipario.min.js',
            src: ['js/sipario.js']
          }
        ]
      }
    },

  });

  // Default task
  grunt.registerTask('default', ['sass', 'postcss']);
  grunt.registerTask('mini', ['uglify']);
};
