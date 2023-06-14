const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const fs = require("fs")

const hbs = require('express-handlebars');

const staticPath = path.join(__dirname, 'static'); // Absolute path to the static directory

app.use(express.static(staticPath));

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    helpers: {
        checkCurrentDir: function(curr_path, paths, inx) {
            if (curr_path == paths[inx]) {
                return true;
            } else {
                return false;
            }
        },
        currPathSplit: function(current_dir) {
            let tab = current_dir.split('/')
            tab = tab.filter(t => t != "")
            return tab
        },
        encodeDir: function(dir, inx) {
            let tab = dir.split('/')
            let finalDir = '/'
            for (let i = 0; i < inx + 1; i++) {
                finalDir += tab[i + 1]
                finalDir += '/'
            }
            const code = encodeURIComponent(finalDir);
            return code;
        },
        encodeDir2: function(dir, t) {
            let temp = ""
            if (dir == "/" || (dir + t).includes("//")) {
                temp = dir.slice(0, -1) + t
            } else {
                temp = dir + t
            }
            const code = encodeURIComponent(temp);
            return code;
        },
        isHome: function(curr) {
            if (curr == '/') {
                return true
            }
            return false
        }
    }
}));
app.set('view engine', 'hbs');

const context = {
    dirs: {
        names: [],
        paths: [],
    },
    files: {
        names: [],
        paths: [],
    },
    current_path: {
        path: 'home>',
        dir: '/'
    },
}

app.get("/", function(req, res) {
    context.current_path = {
        path: 'home>',
        dir: '/'
    }
    context.dirs.names = []
    context.dirs.paths = []
    context.files.names = []
    context.files.paths = []

    fs.readdir(`./upload/`, (err, pliki) => {
        if (err) {
            res.redirect("/")
            return
        }
        pliki.forEach(e => {
            if (path.extname(e) == "") {
                context.dirs.names.push(e)
                context.dirs.paths.push(context.current_path.dir)
            } else {
                context.files.names.push(e)
                context.files.paths.push(context.current_path.dir)
            }
        });
        res.render('filemanager.hbs', context);
    })
})

app.get("/nextDir/:path", function(req, res) {
    const decodedPath = decodeURIComponent(req.params.path);

    context.current_path.path = `home>${decodedPath}>`;
    if (decodedPath.startsWith('/')) {
        context.current_path.dir = `${decodedPath}`;

    } else {
        context.current_path.dir = `/${decodedPath}`;

    }

    if (!context.current_path.dir.endsWith('/')) {
        context.current_path.dir += '/'
    }

    context.dirs.names = []
    context.dirs.paths = []
    context.files.names = []
    context.files.paths = []

    fs.readdir(`./upload${context.current_path.dir}`, (err, pliki) => {
        if (err) {
            res.redirect("/")
            return
        }
        pliki.forEach(e => {
            if (path.extname(e) == "") {
                context.dirs.names.push(e)
                context.dirs.paths.push(context.current_path.dir)
            } else {
                context.files.names.push(e)
                context.files.paths.push(context.current_path.dir)
            }
        });
        res.render('filemanager.hbs', context);
    })
})

app.get("/addDir", function(req, res) {
    let name = req.query.name
    if (name == "" || name == undefined) {
        name = "bez_nazwy"
    }

    while (fs.existsSync(`./upload${context.current_path.dir}${name}`)) {
        name += "-kopia"
    }

    fs.mkdir(`./upload${context.current_path.dir}${name}`, (err) => {
        if (err) {
            res.redirect("/")
            return
        }
        if (context.current_path.dir == "/") {
            res.redirect("/")
        } else {
            res.redirect(`/nextDir/${encodeURIComponent(context.current_path.dir)}`)
        }
    })
})

app.get("/addTxt", function(req, res) {
    let name = req.query.name
    if (name == "" || name == undefined) {
        name = "bez_nazwy"
    }
    let filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${name}.txt`)

    while (fs.existsSync(filepath)) {
        name += "-kopia"
        filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${name}.txt`)
    }

    fs.writeFile(filepath, "", (err) => {
        if (err) {
            res.redirect("/")
            return
        }
        console.log("ok")
        if (context.current_path.dir == "/") {
            res.redirect("/")
        } else {
            res.redirect(`/nextDir/${encodeURIComponent(context.current_path.dir)}`)
        }
    })
})

app.get("/addMulti", function(req, res) {
    let files_names = req.query.name

    files_names.forEach(element => {
        let name = element

        let filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${name}`)

        while (fs.existsSync(filepath)) {
            name += "-kopia"
            filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${name}`)
        }

        fs.writeFile(filepath, "", (err) => {
            if (err) {
                res.redirect("/")
                return
            }
            console.log("ok")
        })
    });

    if (context.current_path.dir == "/") {
        res.redirect("/")
    } else {
        res.redirect(`/nextDir/${encodeURIComponent(context.current_path.dir)}`)
    }
})

app.get("/delTxt", function(req, res) {

    if (fs.existsSync(`./upload${context.current_path.dir}${req.query.name}`)) {
        fs.unlink(`./upload${context.current_path.dir}${req.query.name}`, (err) => {
            if (err) {
                res.redirect("/")
                return
            }
            console.log("deleted")
            if (context.current_path.dir == "/") {
                res.redirect("/")
            } else {
                res.redirect(`/nextDir/${encodeURIComponent(context.current_path.dir)}`)
            }
        })
    } else {
        console.log("error")
        if (context.current_path.dir == "/") {
            res.redirect("/")
        } else {
            res.redirect(`/nextDir/${encodeURIComponent(context.current_path.dir)}`)
        }
    }
})

app.get("/delDir", function(req, res) {
    if (fs.existsSync(`./upload${context.current_path.dir}${req.query.name}`)) {
        fs.rmdir(`./upload${context.current_path.dir}${req.query.name}`, (err) => {
            if (err) {
                res.redirect("/")
                return
            }
            console.log("deleted")
            if (context.current_path.dir == "/") {
                res.redirect("/")
            } else {
                res.redirect(`/nextDir/${encodeURIComponent(context.current_path.dir)}`)
            }
        })
    } else {
        console.log("error")
        if (context.current_path.dir == "/") {
            res.redirect("/")
        } else {
            res.redirect(`/nextDir/${encodeURIComponent(context.current_path.dir)}`)
        }
    }
})

app.get("/renameDir", function(req, res) {
    let name = req.query.name
    if (name == "" || name == undefined) {
        name = "bez_nazwy"
    }

    let path = context.current_path.dir;
    let pathArray = path.split('/');
    pathArray = pathArray.filter(el => el != "")
    pathArray.pop();
    let newPath = pathArray.join('/');
    if (newPath == "") {
        newPath = "/"
    }

    while (fs.existsSync(`./upload${path}${name}`)) {
        name += "-kopia"
    }

    console.log(newPath, name, context.current_path.dir)

    fs.rename(`./upload${context.current_path.dir}`, `./upload${newPath}${name}/`, (err) => {
        if (err) {
            res.redirect("/")
            return
        }
        context.current_path.dir = `${newPath}${name}/`
        if (context.current_path.dir == "/") {
            res.redirect("/")
        } else {
            res.redirect(`/nextDir/${encodeURIComponent(context.current_path.dir)}`)
        }
    })
})


/* --- */

app.listen(PORT, function() {
    console.log("start serwera na porcie " + PORT)
})