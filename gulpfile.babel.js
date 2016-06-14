"use strict";

import gulp from "gulp";
import plumber from "gulp-plumber";
import clean from "gulp-clean";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import babel from "gulp-babel";
import notify from "gulp-notify";

const dirs =
{
    src: "./src/",
    lib: "./lib/",
    dest: "./build/"
};

gulp.task("default", ["build"]);

gulp.task("clean", function()
{
    return gulp.src(`${dirs.dest}`, { read: false })
        .pipe(clean())
        .pipe(notify(
            {
                title: "Annotate Clean",
                message: "Project cleaned",
                onLast: true
            }
        ));
});

gulp.task("copyLib", ["clean"], function()
{
    return gulp.src(`${dirs.lib}**`)
        .pipe(plumber())
        .pipe(gulp.dest(`${dirs.dest}`))
        .pipe(notify(
            {
                title: "Annotate Libs",
                message: "Libraries copied",
                onLast: true
            }
        ));
});

gulp.task("build", ["copyLib"], function()
{
    return gulp.src(`${dirs.src}**.js`)
        .pipe(plumber())
        .pipe(babel(
            {
                presets: "es2015"
            }
        ))
        .pipe(uglify())
        .pipe(rename(
            function(path)
            {
                path.basename += ".min";
            }
        ))
        .pipe(gulp.dest(`${dirs.dest}`))
        .pipe(notify(
            {
                title: "Annotate",
                message: "Build completed",
                onLast: true
            }
        ));
});

gulp.task("watch", function()
{
    gulp.watch(`${dirs.src}**.js`, ["build"]);
});
