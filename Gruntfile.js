// blacksmith

module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			scss: {
				files: ["css/scss/**/*.scss"],
				tasks: ["sass"]
			},
			html: {
				files: ["*.html"]
			},
			js: {
				files: ["js/*.js"]
			}
		},
		sass: {
		  dist: {
				files: {
					'css/main.css': 'css/scss/main.scss'    // 'destination': 'source'
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-notify");

	grunt.registerTask("default", ["watch"]);
};
