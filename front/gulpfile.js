const {src, dest, series, watch} = require("gulp");
const include = require("gulp-file-include"); // Вставка повторяющихся компонентов в файл
const del = require("del"); // Удаление
const sync = require("browser-sync").create(); // Автоматическая перезагрузка

// Компиляция html
function html() {
    return src(["src/html/**.html", "!src/html/_*.html"])
        .pipe(include({
            prefix: "@@"
        }))
        .pipe(dest("dist"))
}

// Компиляция css
function css() {
    return src("src/css/**.css")
        .pipe(dest("dist/assets/css"))
}

// Компиляция image в папке src/img
function img() {
    return src("src/img/**")
        .pipe(dest("dist/assets/img"))
};

// Компиляция javascript
function js() {
    return src("src/script/**")
        .pipe(dest("dist/script"))
};

// Отчистка
function clearDist() {
    return del("dist");
};

// Автоматическая перезагрузка
function serve() {
    sync.init({
        server: "dist",
        notify: false,
        port: 3001
    })

    watch("src/html/*.html", html).on("change", sync.reload);
    watch("src/css/*.css", css).on("change", sync.reload);
    watch("src/img/**.{png, svg}", img).on("change", sync.reload);
    watch("src/script/*.js", js).on("change", sync.reload);
}

exports.serve = series(clearDist, html, css, js, img, serve);