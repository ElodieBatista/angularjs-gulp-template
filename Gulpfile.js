var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    merge = require('merge-stream'),
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
    replace = require('gulp-replace-task'),
    htmlreplace = require('gulp-html-replace');


var paths = {
    /*
     * APP paths
     */
    app: {
        base        : 'app/',

        scripts     : {
            base    :   'app/scripts/app.js',
            modules :   'app/scripts/modules/',
            submodules: 'app/scripts/modules/*/',
            common  : {
                controllers :   'app/scripts/common/controllers/*.js',
                services    :   'app/scripts/common/services/*.js',
                directives  :   'app/scripts/common/directives/*.js'
            },
            libs    : {
                common      :   ['app/scripts/libs/common/*/*.js', 'app/scripts/libs/common/*/*.map'],
                ie7         :   ['app/scripts/libs/ie7/*.js', 'app/scripts/libs/ie7/*/*.js'],
                ie8         :   ['app/scripts/libs/ie8/*.js', 'app/scripts/libs/ie8/*/*.js']
            },
            all     :   ['app/scripts/app.js', 'app/scripts/common/*/*.js', 'app/scripts/modules/*/*.js', 'app/scripts/modules/*/*/*.js']
        },

        views       : {
            base    :   'app/index.html',
            modules :   'app/scripts/modules/',
            common  : {
                directives  :   'app/scripts/common/directives/*.html'
            },
            all     :   ['app/index.html', 'app/scripts/modules/*/*.html', 'app/scripts/common/directives/*.html'],
            allForDist: ['app/scripts/common/directives/*.html', 'app/scripts/modules/*/*.html', 'app/scripts/modules/*/*/*.html']
        },

        styles      : {
            base    :   'app/styles/common/*.scss',
            modules :   'app/scripts/modules/',
            partials:   '/app/styles/partials',
            ie7     :   'app/styles/ie7/*.scss',
            ie8     :   'app/styles/ie8/*.scss',
            libs    : {
                common  :   'app/styles/libs/common/*/*.min.css',
                ie7     :   ['app/styles/libs/ie7/*.min.css', 'app/styles/libs/ie7/*/*.min.css'],
                ie8     :   ['app/styles/libs/ie8/*.min.css', 'app/styles/libs/ie8/*/*.min.css']
            },
            all     :   ['app/styles/common/*.scss', 'app/styles/ie7/*.scss', 'app/styles/ie8/*.scss'],
            allForDist: ['app/styles/common/*.scss', 'app/scripts/modules/*/*.scss', 'app/scripts/modules/*/*/*.scss'],
            fonts   :   'app/styles/fonts/*',
            images  :   'app/styles/images/*'
        },

        data        :   'app/data/*'
    },



    /*
     * BUILD paths
     */
    build: {
        base        :   'build/',

        scripts     : {
            base    :   'build/scripts/',
            modules :   'build/scripts/modules/',
            common  : {
                controllers :   'build/scripts/common/controllers/',
                services    :   'build/scripts/common/services/',
                directives  :   'build/scripts/common/directives/'
            },
            libs    : {
                common      :   'build/scripts/libs/common/',
                ie7         :   'build/scripts/libs/ie7/',
                ie8         :   'build/scripts/libs/ie8/'
            }
        },

        views       : {
            base    :   'build/',
            modules :   'build/scripts/modules/',
            common  : {
                directives  :   'build/scripts/common/directives/'
            }
        },

        styles: {
            base    :   'build/styles/css/',
            libs    : {
                common  :   'build/styles/libs/common/',
                ie7     :   'build/styles/libs/ie7/',
                ie8     :   'build/styles/libs/ie8/'
            },
            fonts   :   'build/styles/fonts/',
            images  :   'build/styles/images/'
        },

        data: 'build/data/'
    },



    /*
     * DIST paths
     */
    dist: {
        base        :   'dist/',

        scripts     : {
            base    :   'dist/scripts/app/',
            libs    : {
                common  :   'dist/scripts/libs/common/',
                ie7     :   'dist/scripts/libs/ie7/',
                ie8     :   'dist/scripts/libs/ie8/'
            }
        },

        styles      : {
            base    :   'dist/styles/css/',
            libs    : {
                common  :   'dist/styles/libs/common/',
                ie7     :   'dist/styles/libs/ie7/',
                ie8     :   'dist/styles/libs/ie8/'
            },
            fonts   :   'dist/styles/fonts/',
            images  :   'dist/styles/images/'
        },

        views       : {
            base    :   'dist/views/'
        },

        data        :   'dist/data/'
    }
};



var app = express();



/*
 * CLEAN Task: Delete the destination directory
 */
gulp.task('clean', function() {
    return gulp.src(paths.build.base, { read: false })
        .pipe(clean());
});
gulp.task('clean-dist', function() {
    return gulp.src(paths.dist.base, { read: false })
        .pipe(clean());
});



/*
 * LINT Task: checks any JavaScript file and makes sure there are no errors in the code
 */
gulp.task('lint', function() {
    return gulp.src(paths.app.scripts.all)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});



/*
 * STYLES Task: Compiles SASS and minifies the generated CSS
 */
gulp.task('styles-base', ['styles-ie7', 'styles-ie8', 'styles-libs-ie7', 'styles-libs-ie8', 'styles-libs-common'], function() {
    return gulp.src(paths.app.styles.base)
        .pipe(concat('styles.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.build.styles.base));
});

gulp.task('styles-ie7', function() {
    return gulp.src(paths.app.styles.ie7)
        .pipe(concat('ie7.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.build.styles.base));
});

gulp.task('styles-ie8', function() {
    return gulp.src(paths.app.styles.ie8)
        .pipe(concat('ie8.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.build.styles.base));
});

gulp.task('styles-libs-ie7', function() {
    return gulp.src(paths.app.styles.libs.ie7)
        .pipe(gulp.dest(paths.build.styles.libs.ie7));
});

gulp.task('styles-libs-ie8', function() {
    return gulp.src(paths.app.styles.libs.ie8)
        .pipe(gulp.dest(paths.build.styles.libs.ie8));
});

gulp.task('styles-libs-common', function() {
    return gulp.src(paths.app.styles.libs.common)
        .pipe(gulp.dest(paths.build.styles.libs.common));
});

gulp.task('styles-modules', folder(paths.app.styles.modules, function(folder) {
    return gulp.src([path.join(paths.app.styles.modules, folder, '*.scss'), path.join(paths.app.styles.modules, folder, '*/*.scss')])
        .pipe(concat(folder + '.scss'))
        .pipe(sass({
            style: 'compressed',
            loadPath: [__dirname + paths.app.styles.partials]
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.build.styles.base, folder));
}));

gulp.task('styles-dist-base', ['styles-dist-ie7', 'styles-dist-ie8', 'styles-dist-libs-ie7', 'styles-dist-libs-ie8', 'styles-dist-libs-common'], function() {
    return gulp.src(paths.app.styles.allForDist)
        .pipe(concat('styles.scss'))
        .pipe(sass({
            style: 'compressed',
            loadPath: [__dirname + paths.app.styles.partials]
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.styles.base));
});

gulp.task('styles-dist-ie7', function() {
    return gulp.src(paths.app.styles.ie7)
        .pipe(concat('ie7.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.styles.base));
});

gulp.task('styles-dist-ie8', function() {
    return gulp.src(paths.app.styles.ie8)
        .pipe(concat('ie8.scss'))
        .pipe(sass({ style: 'compressed' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist.styles.base));
});

gulp.task('styles-dist-libs-ie7', function() {
    return gulp.src(paths.app.styles.libs.ie7)
        .pipe(gulp.dest(paths.dist.styles.libs.ie7));
});

gulp.task('styles-dist-libs-ie8', function() {
    return gulp.src(paths.app.styles.libs.ie8)
        .pipe(gulp.dest(paths.dist.styles.libs.ie8));
});

gulp.task('styles-dist-libs-common', function() {
    return gulp.src(paths.app.styles.libs.common)
        .pipe(gulp.dest(paths.dist.styles.libs.common));
});



/*
 * CLEAN-MAP Task: Deletes sass map files
 */
gulp.task('clean-map', function() {
    return gulp.src(path.join(paths.build.styles.base, '*.map'), { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('clean-dist-map', function() {
    return gulp.src(path.join(paths.dist.styles.base, '*.map'), { read: false })
        .pipe(clean({ force: true }));
});



function getFolders(dir){
    return fs.readdirSync(dir)
        .filter(function(file){
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

function replaceViewsDist(str) {
    var start = str.lastIndexOf('/') + 1;
    return "templateUrl: '/views/" + str.substring(start);
}



/*
 * SCRIPTS Task: Concatenates & minifies our JS
 */
gulp.task('scripts', ['scripts-modules'], function() {
    gulp.src(paths.app.scripts.base)
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.build.scripts.base));

    gulp.src(paths.app.scripts.common.controllers)
        .pipe(concat('controllers.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.build.scripts.common.controllers));

    gulp.src(paths.app.scripts.common.services)
        .pipe(concat('services.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.build.scripts.common.services));

    gulp.src(paths.app.scripts.common.directives)
        .pipe(concat('directives.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.build.scripts.common.directives));

    gulp.src(paths.app.scripts.libs.ie8)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.build.scripts.libs.ie8));

    gulp.src(paths.app.scripts.libs.ie7)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.build.scripts.libs.ie7));

    return gulp.src(paths.app.scripts.libs.common)
        .pipe(gulp.dest(paths.build.scripts.libs.common));
});

gulp.task('scripts-modules', function() {
    var folders = getFolders(paths.app.scripts.modules);
    var subfolders = [], result = [], i, l;

    for (i = 0, l = folders.length; i < l; i++) {
        subfolders.push(getFolders(path.join(paths.app.scripts.modules, folders[i])));
    }

    for (i = 0, l = folders.length; i < l; i++) {
        result.push(folders[i]);
        for (var j = 0, le = subfolders[i].length; j < le; j++) {
            result.push(folders[i] + '/' + subfolders[i][j]);
        }
    }

    var tasks = result.map(function(folder) {
        var str = folder.substring(folder.lastIndexOf('/') + 1);
        return gulp.src(path.join(paths.app.scripts.modules, folder, '/*.js'))
            .pipe(concat(str + '.js'))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(path.join(paths.build.scripts.modules, folder)));
    });

    return merge(tasks);
});

gulp.task('scripts-dist', function() {
    gulp.src(paths.app.scripts.all)
        .pipe(replace({
            patterns: [
                {
                    match: /templateUrl: '\/scripts\/([a-zA-Z]+\/)+[a-zA-Z]+\.tpl\.html'/g,
                    replacement: replaceViewsDist
                }
            ]
        }))
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts.base));

    gulp.src(paths.app.scripts.libs.ie8)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.dist.scripts.libs.ie8));

    gulp.src(paths.app.scripts.libs.ie7)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.build.scripts.libs.ie7));

    return gulp.src(paths.app.scripts.libs.common)
        .pipe(gulp.dest(paths.dist.scripts.libs.common));
});



/*
 * VIEWS Task: Copies index.html into build folder,
 * put views files from app folder and common directives folder into build corresponding folder
 */
gulp.task('views', ['views-modules', 'views-directives'], function() {
    return gulp.src(paths.app.views.base)
        .pipe(gulp.dest(paths.build.views.base));
});

gulp.task('views-modules', folder(paths.app.views.modules, function(folder) {
    return gulp.src([path.join(paths.app.views.modules, folder, '*.html'), path.join(paths.app.views.modules, folder, '*/*.html')])
        .pipe(gulp.dest(path.join(paths.build.views.modules, folder)));
}));

gulp.task('views-directives', function() {
    return gulp.src(paths.app.views.common.directives)
        .pipe(gulp.dest(paths.build.views.common.directives));
});

gulp.task('views-dist', ['views-dist-modules', 'views-dist-directives'], function() {
    return gulp.src(paths.app.views.base)
        .pipe(htmlreplace({
            'css': 'styles/css/styles.min.css',
            'js': 'scripts/app/app.min.js'
        }))
        .pipe(gulp.dest(paths.dist.base));
});

gulp.task('views-dist-modules2', folder(paths.app.views.modules, function(folder) {
    return gulp.src([path.join(paths.app.views.modules, folder, '*.html'), path.join(paths.app.views.modules, folder, '*/*.html')])
        .pipe(gulp.dest(paths.dist.views.base));
}));

gulp.task('views-dist-directives', function() {
    return gulp.src(paths.app.views.common.directives)
        .pipe(gulp.dest(paths.dist.views.base));
});

gulp.task('views-dist-modules', function() {
    var folders = getFolders(paths.app.views.modules);
    var subfolders = [], result = [], i, l;

    for (i = 0, l = folders.length; i < l; i++) {
        subfolders.push(getFolders(path.join(paths.app.views.modules, folders[i])));
    }

    for (i = 0, l = folders.length; i < l; i++) {
        result.push(folders[i]);
        for (var j = 0, le = subfolders[i].length; j < le; j++) {
            result.push(folders[i] + '/' + subfolders[i][j]);
        }
    }

    var tasks = result.map(function(folder) {
        var str = folder.substring(folder.lastIndexOf('/') + 1);
        return gulp.src(path.join(paths.app.scripts.modules, folder, '/*.html'))
            .pipe(gulp.dest(paths.dist.views.base));
    });

    return merge(tasks);
});



/*
 * IMAGES Task: Copies images and put them in the build folder
 */
gulp.task('images', function() {
    return gulp.src(paths.app.styles.images)
        .pipe(gulp.dest(paths.build.styles.images));
});

gulp.task('images-dist', function() {
    return gulp.src(paths.app.styles.images)
        .pipe(gulp.dest(paths.dist.styles.images));
});



/*
 * FONTS Task: Copies fonts and put them in the build folder
 */
gulp.task('fonts', function() {
    return gulp.src(paths.app.styles.fonts)
        .pipe(gulp.dest(paths.build.styles.fonts));
});

gulp.task('fonts-dist', function() {
    return gulp.src(paths.app.styles.fonts)
        .pipe(gulp.dest(paths.dist.styles.fonts));
});



/*
 * DATA Task:  Copies data files and put them in the build folder
 */
gulp.task('data', function() {
    return gulp.src(paths.app.data)
        .pipe(gulp.dest(paths.build.data));
});

gulp.task('data-dist', function() {
    return gulp.src(paths.app.data)
        .pipe(gulp.dest(paths.dist.data));
});



// TEMP
/*
 * JSON Task: JSON responses mockups
 */
gulp.task('json', function() {
    return gulp.src('app/json/*.json')
        .pipe(gulp.dest('build/json'));
});

gulp.task('json-dist', function() {
    return gulp.src('app/json/*.json')
        .pipe(gulp.dest('dist/json'));
});



/*
 * DEFAULT Task: Generate dev files, launch server and listen for files' changes
 */
gulp.task('default', function() {
    runSequence('clean',
        ['lint', 'views', 'styles-base', 'scripts', 'images', 'fonts', 'data', 'json'],
        'styles-modules',
        'clean-map',
        function() {
            // Launch server & live reload
            app.use(livereload());
            app.use(express.static(paths.build.base));
            app.listen(5000);
            console.log('Server running on localhost:5000');
            refresh.listen(35729);

            gulp.watch(paths.app.scripts.all, ['lint', 'scripts']);
            gulp.watch(paths.app.styles.all, ['styles-base']);
            gulp.watch(paths.app.views.all, ['views']);
            gulp.watch(paths.app.styles.images, ['images']);
            gulp.watch(paths.app.data, ['data']);

            // TEMP
            gulp.watch('app/json/*.json', ['json']);

            gulp.watch('build/**').on('change', refresh.changed);
        }
    );
});



/*
 * GENERATE Task: Generate dist files
 */
gulp.task('generate', function() {
    runSequence('clean-dist',
        ['lint', 'views-dist', 'styles-dist-base', 'scripts-dist', 'images-dist', 'fonts-dist', 'data-dist', 'json-dist'],
        'clean-dist-map',
        function() {
            console.log('Files generated OK');
            return 1;
        }
    );
});



/*
 * DIST Task: Generate dist files and launch server
 */
gulp.task('dist', [], function() {
    runSequence('clean-dist',
        ['lint', 'views-dist', 'styles-dist-base', 'scripts-dist', 'images-dist', 'fonts-dist', 'data-dist', 'json-dist'],
        'clean-dist-map',
        function() {
            app.use(express.static(paths.dist.base));
            app.listen(5000);
            console.log('Server running on localhost:5000');
        }
    );
});