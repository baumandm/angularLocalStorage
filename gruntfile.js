'use strict';
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/**\n' +
                ' * <%= pkg.description %>\n' +
                ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * @link <%= pkg.homepage %>\n' +
                ' * @author <%= pkg.author %>\n' +
                ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
                ' */\n'
        },
        dirs: {
            dest: 'dist'
        },
        coffee: {
            compile: {
                files: {
                    'src/<%= pkg.name %>.js': 'src/*.coffee',
                }
            }
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['src/*.js'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/*.js', 'test/unit/*.js'],
            options: {
                curly: false,
                browser: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                expr: true,
                node: true,
                globals: {
                    exports: true,
                    angular: false,
                    $: false
                }
            }
        },

        karma: {
            unit: {
                singleRun: true,
                configFile: 'test/karma.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-karma');

    // Default task.
    grunt.registerTask('default', ['test']);

    // Test tasks.
    grunt.registerTask('test', ['coffee', 'karma:unit']);

    // Build task.
    grunt.registerTask('build', ['test', 'concat', 'uglify']);

};
