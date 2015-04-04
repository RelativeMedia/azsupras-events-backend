module.exports = function(grunt) {


  grunt.config.set('symlink', {
		uploads: {
      dest: '.tmp/public/uploads',
      relativeSrc: '../../uploads',
      options: {type: 'dir'} // 'file' by default
    }
	});

	grunt.loadNpmTasks('grunt-symlink');
};
