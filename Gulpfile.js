var gulp = require('gulp');

var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var clean = require('gulp-rimraf');
var express = require('express');
var refresh = require('gulp-livereload');
var livereload = require('connect-livereload');
var folder = require('gulp-folder');

var paths = {
    app: 'app/',

    scripts: {
        base: 'app/scripts/*.js',
        app: ['app/scripts/app/*/*.js', 'app/scripts/app/*.js'],
        common: {
            controllers :   'app/scripts/common/controllers/*.js',
            services    :   'app/scripts/common/services/*.js',
            directives  :   'app/scripts/common/directives/*.js'
        },
        libs: {
            common      :   ['app/scripts/libs/common/*.js', 'app/scripts/libs/common/*/*.js'],
            ie7         :   ['app/scripts/libs/ie7/*.js', 'app/scripts/libs/ie7/*/*.js'],
            ie8         :   ['app/scripts/libs/ie8/*.js', 'app/scripts/libs/ie8/*/*.js']
        }
    },

    dist: {
        base: 'dist/',
        app: 'dist/app/',

        scripts: {
            base: 'dist/scripts',
            app: 'dist/scripts/app',
            common: {
                controllers :   'dist/scripts/common/controllers',
                services    :   'dist/scripts/common/services',
                directives  :   'dist/scripts/common/directives'
            },
            libs: {
                common      :   'dist/scripts/libs/common',
                ie7         :   'dist/scripts/libs/ie7',
                ie8         :   'dist/scripts/libs/ie8'
            }
        },


        views: 'dist/views',
        images: 'dist/images',
        css: 'dist/css/common',
        cssIE8: 'dist/css/ie8',
        cssIE7: 'dist/css/ie7',
        cssLibs: 'dist/css/lib/',
        fonts: 'dist/css/fonts/',
        data: 'dist/data/',
        js: 'dist/js',
        jsLibs: 'dist/js/lib/common',
        jsLibsIE8: 'dist/js/lib/ie8',
        jsLibsIE7: 'dist/js/lib/ie7',
        controllers: 'dist/js/controllers/',
        services: 'dist/js/services/',
        directives: 'dist/js/directives/'
    },
    html: 'app/index.html',
    views: 'app/views/*.html',
    controllers: 'app/scripts/controllers/*.js',
    services: 'app/scripts/services/*.js',
    directives: 'app/scripts/directives/*.js',
    images: 'app/images/*',
    mainJs: 'app/scripts/*.js',
    js: ['app/scripts/*.js', 'app/scripts/controllers/*.js', 'app/scripts/services/*.js', 'app/scripts/directives/*.js'],
    jsLibs: ['app/scripts/libs/common/*/*.js', 'app/scripts/libs/common/*/*.js.map'],
    jsLibsIE8: ['app/scripts/libs/ie8/*/*.js', 'app/scripts/libs/ie8/*.js'],
    jsLibsIE7: ['app/scripts/libs/ie7/*/*.js', 'app/scripts/libs/ie7/*.js'],
    css: 'app/styles/common/*.scss',
    cssIE8: 'app/styles/ie8/*.scss',
    cssIE7: 'app/styles/ie7/*.scss',
    cssLibs: 'app/styles/libs/*/*.css',
    fonts: 'app/styles/fonts/*',
    data: 'app/data/*'
};


// Delete the dist directory
gulp.task('clean', function() {
    return gulp.src(paths.dist.base)
        .pipe(clean());
});

// Lint Task: checks any JavaScript file and makes sure there are no errors in our code
gulp.task('lint', function() {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Styles Task: Compiles our Sass and minifies the generated Css
gulp.task('styles', function() {
    // SASS files
    gulp.src(paths.css)
        .pipe(concat('all.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.css));

    gulp.src(paths.cssIE8)
        .pipe(concat('ie8.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest(paths.dist.cssIE8))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.cssIE8));

    gulp.src(paths.cssIE7)
        .pipe(concat('ie7.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest(paths.dist.cssIE7))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.cssIE7));

    // CSS Libraries
    gulp.src(paths.cssLibs)
        .pipe(concat('proprietary.css'))
        .pipe(gulp.dest(paths.dist.cssLibs))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.cssLibs));

    // Fonts
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(paths.dist.fonts));
});

// Scripts Task: Concatenates & minifies our JS
gulp.task('scripts', function() {
    // App.js
    gulp.src(paths.scripts.base)
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts.base));

    // Common Controllers
    gulp.src(paths.scripts.common.controllers)
        .pipe(concat('controllers.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts.common.controllers));

    // Common Services
    gulp.src(paths.scripts.common.services)
        .pipe(concat('services.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts.common.services));

    // Common Directives
    gulp.src(paths.scripts.common.directives)
        .pipe(concat('directives.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts.common.directives));

    // App Scripts
    gulp.src(path.join(paths.scripts.app, folder, '*.js'))
        .pipe(concat(folder + '.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts.app));

    //JS Libraries for IE8
    gulp.src(paths.scripts.libs.ie8)
        .pipe(concat('proprietaryIE8.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.scripts.libs.ie8));

    //JS Libraries for IE7
    gulp.src(paths.scripts.libs.ie7)
        .pipe(concat('proprietaryIE7.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.scripts.libs.ie7));

    // JS Libraries
    return gulp.src(paths.scripts.libs.common)
        .pipe(gulp.dest(paths.dist.scripts.libs.common));
});

// Html Task: Copies index.html and views files and put them in the dist folder
gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(gulp.dest(paths.dist.base));

    return gulp.src(paths.views)
        .pipe(gulp.dest(paths.dist.views));
});

// Images Task: Copies images and put them in the dist folder
gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.dist.images));
});

// Data Task: Copies data files and put them in the dist folder
gulp.task('data', function() {
    return gulp.src(paths.data)
        .pipe(gulp.dest(paths.dist.data));
});

// TEMP: JSON responses mockups
gulp.task('json', function() {
    return gulp.src('app/json/*.json')
        .pipe(gulp.dest('dist/json'));
});

// Server configuration
var app = express();
app.use(livereload());
app.use(express.static(paths.dist.base));


// Default task
gulp.task('default', function() {
    runSequence('clean',
        ['lint', 'html', 'styles', 'scripts', 'images', 'data', 'json'],
        function() {
            app.listen(5000);
            refresh.listen(35729);

            gulp.watch(paths.scripts.base, ['lint', 'scripts']);
            gulp.watch(paths.css, ['styles']);
            gulp.watch([paths.html, paths.views], ['html']);
            gulp.watch(paths.data, ['data']);
            gulp.watch('app/json/*.json', ['json']);
            gulp.watch('dist/**').on('change', refresh.changed);
        }
    );
});

gulp.task('generate', function() {
    runSequence('clean',
        ['lint', 'html', 'styles', 'scripts', 'images', 'data', 'json'],
        function() {
            console.log('Files generated OK');
            return 1;
        }
    );
});

// Prod task
gulp.task('prod', [], function() {
    app.listen(5000);
});