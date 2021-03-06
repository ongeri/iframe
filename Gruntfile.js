module.exports = function (grunt) {

    require('time-grunt')(grunt); //display elapsed time in the cmd
    require('load-grunt-tasks')(grunt); // loads all the plugins available.

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: ['dist'],
            dev: ['dist'],
            prod: ['dist']
        },

        browserify: {
            vendor: {
                src: ['client/index.js'], /****/
                dest: 'dist/build.js',
                options: {
                    transform: [['babelify', {presets: ['es2015']}]]
                }
            },
            internal: {
                src: ['client/internal/index.js'],
                dest: 'dist/internal.js',
                options: {
                    transform: [['babelify', {presets: ['es2015']}]]
                }
            },
            client: {
                src: ['client/webrobot/index.js'],
                dest: 'dist/client.js',
                options: {
                    transform: [['babelify', {presets: ['es2015']}]]
                }
            }

        },
        less: {
            transpile: {
                files: {
                    'build/<%= pkg.name %>.css': [
                        'client/styles/*.css',
                        'client/requires/*/css/*'
                    ]
                }
            }
        },
        concat: {
            'build/<%= pkg.name %>.js': ['build/vendor.js', 'build/app.js'], /**removed app.js**/
            'build/admin.js': ['build/vendor.js', 'build/admin_app.js']
        },
        copy: {
            options: {
                processContentExclude: ['*.{png,gif,jpg,ico}']
            },
            dev: {
                options: {
                    processContentExclude: ['*.{png,gif,jpg,ico}']

                },
                files: [{
                    src: 'build/<%= pkg.name %>.js',
                    dest: 'public/js/<%= pkg.name %>.js'
                }, {
                    src: 'build/<%= pkg.name %>.css',
                    dest: 'public/css/<%= pkg.name %>.css'
                }, {
                    src: 'build/admin.js',
                    dest: 'public/js/admin.js'

                }, {
                    src: 'client/img/spinner_small.gif',
                    dest: 'public/img/',
                    flatten: true,
                    processContentExclude: ['*.{png,gif,jpg,ico}']
                }]
            },
            prod: {
                files: [{
                    src: ['client/img/*'],
                    dest: 'dist/img/'
                }]
            }
        },

        // CSS minification.
        cssmin: {
            minify: {
                src: ['build/<%= pkg.name %>.css'],
                dest: 'dist/css/<%= pkg.name %>.css'
            }
        },
        // Javascript minification.
        uglify: {
            compile: {
                options: {
                    //compress: true,
                    verbose: true,
                    mangle: true,
                    compress: {
                        drop_console: true
                    }
                },
                files: [{
                    src: 'dist/build.js',
                    dest: 'dist/prod/build.js'
                },
                    {
                        src: 'dist/client.js',
                        dest: 'dist/prod/client.js'
                    },
                    {
                        src: 'dist/internal.js',
                        dest: 'dist/prod/internal.js'
                    }
                ]
            }
        },

        // for changes to the front-end code
        watch: {
            scripts: {
                files: ['client/*.js', 'client/**/*.js'],
                tasks: ['clean:dev', 'jshint:all', 'browserify:vendor', 'browserify:internal', 'browserify:client']
            }
        },

        // for changes to the node code
        nodemon: {
            dev: {
                options: {
                    file: 'index.js',
                    nodeArgs: ['--debug'],
                    watchedFolders: ['server', 'client'],
                    env: {
                        PORT: '3000'
                    }
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'watch:scripts'], /** Removed database layer 00 'shell:mongo', **/
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'client/*.js']
        }
    });

    grunt.registerTask('init:dev', ['clean:dev', 'npm install', 'browserify:vendor']);


    grunt.registerTask('build:dev', ['clean:dev', 'jshint:all', 'browserify:vendor', 'browserify:internal', 'browserify:client']);


    grunt.registerTask('server', ['build:dev', 'concurrent:dev']);

    grunt.registerTask('build:prod', ['build:dev', 'uglify']);


};