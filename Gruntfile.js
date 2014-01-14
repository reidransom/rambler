/* global module:false */

var path = require('path')

module.exports = function(grunt) {

    var config = {
        src: 'src',
        build: 'build'
    }

    // Task configuration
    grunt.initConfig({

        config: config,

        pkg: grunt.file.readJSON('package.json'),

        svgmin: {
            src: {
                files: [
                    {
                        expand: true,
                        src: ['build/img/*.svg']
                    }
                ]
            }
        },

        svg2png: {
            src: {
                files: [
                    { src: ['src/img/*.svg'] }
                ]
            }
        },

        imagemin: {
            build: {
                files: [{
                    expand: true,
                    src: ['build/img/*.{png,jpg,gif}']
                }]
            }
        },

        sass: {
            main: {
                files: {
                    'src/css/main.css': 'src/css/main.scss'
                }
            }
        },

        watch: {
            sass: {
                files: ['src/css/**/*.scss'],
                tasks: 'sass'
            }
        },

        synchard: {
            build: {
                options: {
                    args: [
                        '--checksum',
                        '--archive',
                        '--verbose',
                        '--delete',
                        '--delete-excluded'
                    ],
                    exclude: [
                        '.DS_Store',
                        '.git*',
                        'js/*',            // handled by usemin
                        'css/*',           // handled by usemin
                        'bower_components' // handled by usemin
                    ]
                },
                files: {
                    'build/': 'src/'
                }
            },
            stage: {
                options: {
                    args: [
                        '--checksum',
                        '--archive',
                        '--verbose',
                        '--delete',
                        '--delete-excluded'
                    ],
                    exclude: [
                        '.DS_Store'
                    ]
                },
                files: {
                    'reidransom@reidransom.com:webapps/notes/': 'build/'
                }
            },
            deploy: {
                options: {
                    args: [
                        '--checksum',
                        '--archive',
                        '--verbose',
                        '--delete',
                        '--delete-excluded'
                    ],
                    exclude: [
                        '.DS_Store'
                    ]
                },
                files: {
                    'reidransom@reidransom.com:webapps/notes/': 'build/'
                }
            }
        },

        modernizr: {
            devFile: 'src/bower_components/modernizr/modernizr.js',
            outputFile: 'build/js/modernizr.js',
            files: ['src/js/**/*.js']
        },

        htmlmin: {
            options: {
                //collapseWhitespace: true,
                removeComments: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                collapseBooleanAttributes: true,
                removeOptionalTags: true
            },
            build: {
                files: [{
                    expand: true,
                    src: 'build/*.html',
                }]
            }
        },

        filerev: {
            images: {
                src: ['build/img/*']
            },
            jscss: {
                src: [
                    'build/js/*.js',
                    'build/css/*.css'
                ]
            }
        },

        useminPrepare: {
            html: 'build/index.html',
            options: {
                root: 'src',
                dest: 'build'
            }
        },

        usemin: {
            options: {
                assetsDirs: ['build']
            },
            html: 'build/index.html',
            css:  'build/css/*.css'
        },

        express: {
            dev: {
                options: {
                    script: 'server.js'
                }
            }
        }

    })

    // Dependencies
    require('load-grunt-tasks')(grunt)

    // Multi-tasks
    grunt.registerTask('default', [
        'sass',
        'watch'
    ])
    grunt.registerTask('build', [
        'sass',
        'svg2png',          // todo: make a cacheing version of this
        'synchard:build',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'svgmin',
        'imagemin',
        'filerev:images',
        'usemin:css',
        'modernizr',
        'filerev:jscss',
        'usemin:html',
        'htmlmin'
    ])
    grunt.registerTask('stage', [
        'synchard:stage'
    ])
    grunt.registerTask('deploy', [
        'synchard:deploy'
    ])

}
