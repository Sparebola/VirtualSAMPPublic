const {src, dest, series} = require("gulp");
const csso = require("gulp-csso"); // Минимизация css
const htmlmin = require("gulp-htmlmin"); // Минимизация html
const uglify = require('gulp-uglify-es').default; // Минимизация js
const include = require("gulp-file-include"); // Вставка повторяющихся компонентов в файл
const del = require("del"); // Удаление
const autoprefixer = require("gulp-autoprefixer"); // Префиксы для поддержки старых браузеров
const imagemin = require('gulp-imagemin'); // Оптимизация картинок

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
        .pipe(dest("dist"));
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
        .pipe(dest("dist/assets/css"));
}

// Компиляция image в папке src/img
function img() {
    return src("src/img/**")
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
        .pipe(dest("dist/assets/img"));
};

// Компиляция javascript
function js() {
    return src("src/script/**.js")
        .pipe(uglify())
        .pipe(dest("dist/script"));
};

// Отчистка
function clearDist() {
    return del("dist");
};

exports.build = series(clearDist, html, css, js, img); // Скомпилировать проект