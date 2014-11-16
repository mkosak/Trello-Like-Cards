module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            src: [
                'dist',
                'src/js/app.js',
                'src/js/app.min.js',
                'src/js/libs.js'
            ]
        },
        concat: {
            options: {
                separator: ';\n\n'
            },
            app: {
                src: [
                    'src/js/app/app.main.js',
                    'src/js/app/app.utils.js',
                    'src/js/app/app.card.js',
                    'src/js/app/app.events.js'
                ],
                dest: 'src/js/app.js'
            },
            libs: {
                src: [
                    'src/js/libs/jquery.min.js',
                    'src/js/libs/bootstrap.min.js'
                ],
                dest: 'src/js/libs.js'
            }
        },
        uglify: {
            dist: {
                options: {
                    sourceMap: 'src/js/app.min.map',
                    sourceMappingURL: 'app.min.map'
                },
                files: {
                    'src/js/app.min.js': ['<%= concat.app.dest %>']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['concat', 'uglify']);
    //grunt.registerTask('default', ['concat']);
};
