const {src, dest, series} = require("gulp");
const csso = require("gulp-csso"); // Минимизация css
const htmlmin = require("gulp-htmlmin"); // Минимизация html
const uglify = require('gulp-uglify-es').default; // Минимизация js
const include = require("gulp-file-include"); // Вставка повторяющихся компонентов в файл
const del = require("del"); // Удаление
const autoprefixer = require("gulp-autoprefixer"); // Префиксы для поддержки старых браузеров
const imagemin = require('gulp-imagemin'); // Оптимизация картинок
const rev = require('gulp-rev'); // Добавление хэша после названия
const revCollector = require('gulp-rev-collector'); // Изменение названия подключения в link

// Компиляция html
function html() {
    return src(["src/html/**.html", "!src/html/_*.html"])
        .pipe(include({
            prefix: "@@"
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true
        }))
        // .pipe(rev())
        .pipe(dest("dist/rev/template"))
        .pipe(rev.manifest())
        .pipe(dest("dist/rev/html"));
}

// Компиляция css
function css() {
    return src("src/css/**.css")
        .pipe(autoprefixer({
            overrideBrowserslist: [
                "last 2 versions"
            ]
        }))
        .pipe(csso())
        .pipe(rev())
        .pipe(dest("dist/rev/template"))
        .pipe(rev.manifest())
        .pipe(dest("dist/rev/css"));
}

// Компиляция image в папке src/img
function img() {
    // return src(["src/img/*", "!src/img/samap.png", "!src/img/samapCap.png"])
    return src("src/img/*")
        // .pipe(imagemin({
        //     progressive: true,
        //     svgoPlugins: [
        //         {
        //             removeViewBox: true
        //         }
        //     ],
        //     interlaced: true,
        //     optimizationLevel: 3
        // }))
        .pipe(rev())
        .pipe(dest("dist/assets/img"))
        .pipe(rev.manifest())
        .pipe(dest("dist/rev/img"));
};

// Просто копирование картинок из img/Fists с сжатием
function imgFist() {
    return src("src/img/Fists/*.png")
        // .pipe(imagemin({
        //     progressive: true,
        //     interlaced: true,
        //     optimizationLevel: 5
        // }))
        .pipe(dest("dist/assets/img/Fists"));
};

// Компиляция javascript
function js() {
    return src("src/script/**.js")
        .pipe(uglify())
        .pipe(rev())
        .pipe(dest("dist/script"))
        .pipe(rev.manifest())
        .pipe(dest("dist/rev/script"));
};

// Меняем подключение всех файлов в html
function revHtml() {
    return src(['dist/rev/**/*.json', 'dist/rev/template/*.html'])
        .pipe( revCollector({
            replaceReved: true
        }))
        .pipe(dest('dist'));
}

// Меняем подключение всех файлов в css
function revCss() {
    return src(['dist/rev/**/*.json', 'dist/rev/template/*.css'])
        .pipe( revCollector({
            replaceReved: true
        }))
        .pipe(dest('dist/assets/css'));
}

// Отчистка
function clearDist() {
    return del("dist");
};

// Отчистка
function clearRev() {
    return del("dist/rev");
};

exports.build = series(clearDist, html, css, js, img, imgFist, revHtml, revCss, clearRev); // Скомпилировать проект