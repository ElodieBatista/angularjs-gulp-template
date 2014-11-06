var gulp = require('gulp'),
    path = require('path'),
    runSequence = require('run-sequence'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-ruby-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    clean = require('gulp-rimraf'),
    express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    folder = require('gulp-folders'),
    replace = require('gulp-replace-task');


var paths = {
    app: {
        base: 'app/',

        scripts: {
            base: 'app/scripts/*.js',
            app: 'app/scripts/app/',
            common: {
                controllers :   'app/scripts/common/controllers/*.js',
                services    :   'app/scripts/common/services/*.js',
                directives  :   'app/scripts/common/directives/*.js'
            },
            libs: {
                common      :   ['app/scripts/libs/common/*.js', 'app/scripts/libs/common/*/*.js', 'app/scripts/libs/common/*.map', 'app/scripts/libs/common/*/*.map'],
                ie7         :   ['app/scripts/libs/ie7/*.js', 'app/scripts/libs/ie7/*/*.js'],
                ie8         :   ['app/scripts/libs/ie8/*.js', 'app/scripts/libs/ie8/*/*.js']
            },
            all: ['app/scripts/*.js', 'app/scripts/common/*/*.js', 'app/scripts/common/*/*/*.js', 'app/scripts/app/*/*.js']
        },

        views: {
            base: 'app/index.html',
            app: 'app/scripts/app/',
            common: {
                directives  :   'app/scripts/common/directives/*/*.html'
            }
        },

        styles: {
            base    :   'app/styles/common/*.scss',
            app     :   'app/scripts/app/',
            ie7     :   'app/styles/ie7/*.scss',
            ie8     :   'app/styles/ie8/*.scss',
            libs    : {
                common  :   'app/styles/libs/common/*/*.min.css',
                ie7     :   'app/styles/libs/ie7/*/*.min.css',
                ie8     :   'app/styles/libs/ie8/*/*.min.css'
            },
            fonts   :   'app/styles/fonts/*',
            all     :   ['app/styles/common/*.scss', 'app/styles/ie7/*.scss', 'app/styles/ie8/*.scss']
        }
    },



    dist: {
        base: 'dist/',

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

        views: {
            base: 'dist/',
            app: 'dist/scripts/app/',
            common: {
                directives  :   'dist/scripts/common/directives/'
            }
        },

        styles: {
            base    :   'dist/styles/common/',
            app     :   'dist/scripts/app/',
            libs    : {
                common  :   'dist/styles/libs/common/',
                ie7     :   'dist/styles/libs/ie7/',
                ie8     :   'dist/styles/libs/ie8/'
            },
            fonts   :   'dist/styles/fonts/'
        },

        images: 'dist/images/',
        data: 'dist/data/'
    },

    images: 'app/images/*',
    data: 'app/data/*',

    prod: {
        base: 'prod/',

        scripts: {
            base: 'prod/scripts/app/',
            libs: {
                common: 'prod/scripts/libs/common/',
                ie7: 'prod/scripts/libs/ie7/',
                ie8: 'prod/scripts/libs/ie8/'
            }
        },

        styles: {
            base: 'prod/styles/',
            libs: {
                common: 'prod/styles/libs/common/',
                ie7: 'prod/styles/libs/ie7/',
                ie8: 'prod/styles/libs/ie8/'
            },
            fonts: 'prod/fonts/'
        },

        views: {
            base: 'prod/views/'
        }
    }
};



/*
 * CLEAN Task: Delete the dist directory
 */
gulp.task('clean', function() {
    return gulp.src(paths.dist.base, { read: false })
        .pipe(clean());
});



/*
 * LINT Task: checks any JavaScript file and makes sure there are no errors in our code
 */
gulp.task('lint', function() {
    return gulp.src(paths.app.scripts.all)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});



/*
 * STYLES Task: Compiles our SASS and minifies the generated CSS
 */
gulp.task('styles-base', ['styles-app', 'styles-ie7', 'styles-ie8', 'styles-libs-ie7', 'styles-libs-ie8', 'styles-libs-common'], function() {
    return gulp.src(paths.app.styles.base)
        .pipe(concat('styles.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.styles.base));
});

gulp.task('styles-ie7', function() {
    return gulp.src(paths.app.styles.ie7)
        .pipe(concat('ie7.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.styles.base));
});

gulp.task('styles-ie8', function() {
    return gulp.src(paths.app.styles.ie8)
        .pipe(concat('ie8.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.styles.base));
});

gulp.task('styles-libs-ie7', function() {
    return gulp.src(paths.app.styles.libs.ie7)
        .pipe(concat('proprietary-ie7.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.styles.libs.ie7));
});

gulp.task('styles-libs-ie8', function() {
    return gulp.src(paths.app.styles.libs.ie8)
        .pipe(concat('proprietary-ie8.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.styles.libs.ie8));
});

gulp.task('styles-libs-common', function() {
    return gulp.src(paths.app.styles.libs.common)
        .pipe(concat('proprietary.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.styles.libs.common));
});

gulp.task('styles-app', folder(paths.app.styles.app, function(folder) {
    return gulp.src(path.join(paths.app.styles.app, folder, '*.scss'))
        .pipe(concat(folder + '.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.styles.base, folder));
}));

/*
 * CLEAN-MAP Task: Delete sass map files
 */
gulp.task('clean-map', function() {
    return gulp.src(path.join(paths.dist.styles.base, '*.map'), { read: false })
        .pipe(clean({ force: true }));
});



/*
 * SCRIPTS Task: Concatenates & minifies our JS
 */
gulp.task('scripts', ['scripts-app'], function() {
    // App.js
    gulp.src(paths.app.scripts.base)
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts.base));

    // Common Controllers
    gulp.src(paths.app.scripts.common.controllers)
        .pipe(concat('controllers.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts.common.controllers));

    // Common Services
    gulp.src(paths.app.scripts.common.services)
        .pipe(concat('services.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts.common.services));

    // Common Directives
    gulp.src(paths.app.scripts.common.directives)
        .pipe(concat('directives.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts.common.directives));

    //JS Libraries for IE8
    gulp.src(paths.app.scripts.libs.ie8)
        .pipe(concat('proprietary-ie8.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.scripts.libs.ie8));

    //JS Libraries for IE7
    gulp.src(paths.app.scripts.libs.ie7)
        .pipe(concat('proprietary-ie7.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.scripts.libs.ie7));

    // JS Libraries
    return gulp.src(paths.app.scripts.libs.common)
        .pipe(gulp.dest(paths.dist.scripts.libs.common));
});

// App Scripts
gulp.task('scripts-app', folder(paths.app.scripts.app, function(folder) {
    return gulp.src(path.join(paths.app.scripts.app, folder, '*.js'))
        .pipe(concat(folder + '.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(path.join(paths.dist.scripts.app, folder)));
}));



/*
 * VIEWS Task: Copies index.html into dist folder,
 * put views files from app folder and common directives folder into dist corresponding folder
 */
gulp.task('views', ['views-app', 'views-directives'], function() {
    gulp.src(paths.app.views.base)
        .pipe(gulp.dest(paths.dist.views.base));
});

gulp.task('views-app', folder(paths.app.views.app, function(folder) {
    return gulp.src(path.join(paths.app.views.app, folder, '*.html'))
        .pipe(gulp.dest(path.join(paths.dist.views.app, folder)));
}));

gulp.task('views-directives', folder(paths.app.views.app, function(folder) {
    return gulp.src(path.join(paths.app.views.common.directives, folder, '*.html'))
        .pipe(gulp.dest(path.join(paths.dist.views.common.directives, folder)));
}));



/*
 * IMAGES Task: Copies images and put them in the dist folder
 */
gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.dist.images));
});



/*
 * FONTS Task: Copies fonts and put them in the dist folder
 */
gulp.task('fonts', function() {
    return gulp.src(paths.app.styles.fonts)
        .pipe(gulp.dest(paths.dist.styles.fonts));
});



/*
 * DATA Task:  Copies data files and put them in the dist folder
 */
gulp.task('data', function() {
    return gulp.src(paths.data)
        .pipe(gulp.dest(paths.dist.data));
});



// TEMP
/*
 * JSON Task: JSON responses mockups
 */
gulp.task('json', function() {
    return gulp.src('app/json/*.json')
        .pipe(gulp.dest('dist/json'));
});



// Server configuration
var app = express();
app.use(livereload());
app.use(express.static(paths.dist.base));



/*
 * DEFAULT Task: Generate dev files, launch server and listen for files' changes
 */
gulp.task('default', function() {
    runSequence('clean',
        ['lint', 'views', 'styles-base', 'scripts', 'images', 'fonts', 'data', 'json'],
        'clean-map',
        function() {
            app.listen(5000);
            refresh.listen(35729);

            gulp.watch(paths.app.scripts.all, ['lint', 'scripts']);
            gulp.watch(paths.app.styles.all, ['styles-base']);
            gulp.watch([paths.app.views.base, paths.app.views.app], ['views']);
            gulp.watch(paths.data, ['data']);
            gulp.watch('app/json/*.json', ['json']);
            gulp.watch('dist/**').on('change', refresh.changed);
        }
    );
});



/*
 * GENERATE Task: Generate prod files
 */
gulp.task('generate', function() {
    runSequence('clean',
        ['lint', 'views', 'styles', 'scripts', 'images', 'data', 'json'],
        function() {
            console.log('Files generated OK');
            return 1;
        }
    );
});



/*
 * PROD Task: Generate prod files and launch server
 */
gulp.task('prod', [], function() {
    app.listen(5000);
});