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

        clean: {
            build: ['build/public', 'build/views']
        },

        copy: {
            build: {src: 'views/*', dest: 'build/'}
        },

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
                options: {
                    cacheLocation: '/tmp/sass-cache'
                },
                files: {
                    '.tmp/sass/main.css': 'public/css/main.scss'
                }
            }
        },

        autoprefixer: {
            main: {
                files: {
                    'public/css/main.css': '.tmp/sass/main.css'
                }
            }
        },

        watch: {
            sass: {
                files: ['public/css/**/*.scss'],
                tasks: 'sass'
            },
            autoprefixer: {
                files: ['.tmp/sass/main.css'],
                tasks: 'autoprefixer'
            }
        },

        synchard: {
            deploy: {
                options: {
                    args: [
                        '--checksum',
                        '--archive',
                        '--verbose',
                        '--delete'
                    ],
                    exclude: [
                        '.DS_Store',
                        'node_modules',
                        '.git',
                        '/public',
                        '/views',
                        'data.db',
                        '.tmp',
                        'test'
                    ]
                },
                files: {
                    'reidransom@reidransom.com:webapps/ramble/ramble/': './'
                }
            },
            getdb: {
                files: {
                    './data.db': 'reidransom@reidransom.com:webapps/ramble/ramble/data.db'
                }
            },
            dev: {
                files: {
                    './public/fonts/': './public/bower_components/font-awesome/fonts/'
                }
            },
            build: {
                files: {
                    './build/public/fonts/': './public/bower_components/font-awesome/fonts/'
                }
            }
        },

        bgShell: {
            wfupdate: {
                cmd: 'ssh reidransom@reidransom.com ./webapps/ramble/ramble/bin/wfupdate'
            }
        },

        replace: {
            build: {
                options: {
                    prefix: '',
                    patterns: [
                        {
                            match: "url: '/note', // grunt-replace",
                            replacement: "url: '/ramble/note', // grunt-replace"
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/js/',
                        src: 'main.js',
                        dest: '.tmp/concat/js/'
                    }
                ]
            }
        },

        modernizr: {
            devFile: 'public/bower_components/modernizr/modernizr.js',
            outputFile: 'build/public/js/modernizr.js',
            files: ['public/js/**/*.js']
        },

        filerev: {
            images: {
                src: ['build/public/img/*']
            },
            jscss: {
                src: [
                    'build/public/js/*.js',
                    'build/public/css/*.css'
                ]
            }
        },

        useminPrepare: {
            html: 'build/views/index.ejs',
            options: {
                root: 'public',
                dest: 'build/public'
            }
        },

        usemin: {
            options: {
                assetsDirs: ['build/public']
            },
            html: 'build/views/index.ejs',
            css:  'build/public/css/*.css'
        }

    })

    // Dependencies
    require('load-grunt-tasks')(grunt)

    // Multi-tasks
    grunt.registerTask('default', [
        'synchard:dev',
        'sass',
        'autoprefixer',
        'watch'
    ])
    grunt.registerTask('build', [
        'clean',
        'copy',
        'synchard:dev',
        'sass',
        'autoprefixer',
        'svg2png',          // todo: make a cacheing version of this
        'useminPrepare',
        'concat',
        'replace',
        'uglify',
        'cssmin',
        'svgmin',
        'imagemin',
        'filerev:images',
        'usemin:css',
        //'modernizr',
        'filerev:jscss',
        'usemin:html',
        'synchard:build'
    ])
    grunt.registerTask('deploy', [
        'build',
        'synchard:deploy',
        'bgShell:wfupdate'
    ])

}
