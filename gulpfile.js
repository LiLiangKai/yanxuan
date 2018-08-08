const gulp = require('gulp');
const browserSync = require('browser-sync').create();
// const browserSync = require('browser-sync');
const proxy = require('http-proxy-middleware')
// const reload = browserSync.reload;


gulp.task("server", function() {
	const apiProxy = proxy('/api', {
		target: "http://localhost:8080",
		changeOrigin: true,
		pathRewrite: {
			'^/api': '/'
		}
	});
	browserSync.init({
		server: {
			baseDir: './',
			middleware: [apiProxy],
			index: 'index.html'
		},
		host: 'localhost',
		port: 3000,
		files: [
			"*.html",
			"pages/*.html",
			"pages/*/*.html",
			"public/style/*.css",
			"public/script/*.js",
			"public/server/*.json"
		]
	});
	// gulp.watch('public/**/*').on('change', reload);
});

gulp.task("default", function() {
	gulp.start("server");
});
