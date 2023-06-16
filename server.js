const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const fs = require("fs")

const hbs = require('express-handlebars');

const staticPath = path.join(__dirname, 'static');

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
        },
        getExt: function(fn) {
            return fn.slice(-3)
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
    imgs: {
        names: [],
        paths: [],
    },
    current_path: {
        path: 'home>',
        dir: '/'
    },
    files_context: {
        curr_filename: '',
        curr_file_val: '',
        bgc: 'rgb(255, 255, 255)',
        c: 'rgb(0, 0, 0)',
        fs: '20px'
    },
    img_context: {
        curr_img: '',
        curr_img_path: '',
        curr_img_filter: ''
    },
    effects: [
        { name: "grayscale" },
        { name: "invert" },
        { name: "sepia" }
    ],
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
    context.imgs.names = []
    context.imgs.paths = []

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
        fs.readdir(`./static/imgs`, (err, pliki) => {
            if (err) {
                res.redirect("/")
                return
            }
            pliki.forEach(e => {
                if (path.extname(e) == ".jpg" || path.extname(e) == ".jpeg" || path.extname(e) == ".png") {
                    context.imgs.names.push(e)
                    context.imgs.paths.push(context.current_path.dir)
                }
            });
            res.render('filemanager.hbs', context);
        })
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
    context.imgs.names = []
    context.imgs.paths = []

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
        fs.readdir(`./static/imgs`, (err, pliki) => {
            if (err) {
                res.redirect("/")
                return
            }
            pliki.forEach(e => {
                if (path.extname(e) == ".jpg" || path.extname(e) == ".jpeg" || path.extname(e) == ".png") {
                    context.imgs.names.push(e)
                    context.imgs.paths.push(context.current_path.dir)
                }
            });
            res.render('filemanager.hbs', context);
        })
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
    let ftype = req.query.filetype
    if (name == "" || name == undefined) {
        name = "bez_nazwy"
    }
    let filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${name}.${ftype}`)

    while (fs.existsSync(filepath)) {
        name += "-kopia"
        filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${name}.${ftype}`)
    }

    let content = ""

    switch (ftype) {
        case 'html':
            content = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <p>default html</p>
            </body>
            </html>`
            break;
        case 'xml':
            content = `<?xml version="1.0" encoding="UTF-8"?>
            <default>
                <text>default xml</text>
            </default>`
            break;
        case 'json':
            content = `{
                "default":"json"
            }`
            break;
        case 'css':
            content = `*
            {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }`
            break;
        case 'js':
            content = `console.log("Default js")`
            break;
        default:
            content = "default text"
            break;
    }

    fs.writeFile(filepath, content, (err) => {
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
    let n = 1
    if (typeof(files_names) == "object") {
        n = files_names.length
    }
    let name = ''

    for (let i = 0; i < n; i++) {
        if (typeof(files_names) == "object") {
            name = files_names[i]
        } else {
            name = files_names
        }

        let filepath = ''

        if (path.extname(name) == ".jpg" || path.extname(name) == ".jpeg" || path.extname(name) == ".png") {
            filepath = path.join(__dirname, `static/imgs${context.current_path.dir}`, `${name}`)
        } else {
            filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${name}`)
        }

        while (fs.existsSync(filepath)) {
            name += "-kopia"
            if (path.extname(name) == ".jpg" || path.extname(name) == ".jpeg" || path.extname(name) == ".png") {
                filepath = path.join(__dirname, `static/imgs${context.current_path.dir}`, `${name}`)
            } else {
                filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${name}`)
            }
        }

        fs.writeFile(filepath, "", (err) => {
            if (err) {
                res.redirect("/")
                return
            }
            console.log("ok")
        })
    }

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

app.get('/openEditor/:filename', function(req, res) {
    context.files_context.bgc = 'rgb(255, 255, 255)'
    context.files_context.c = 'rgb(0, 0, 0)'
    context.files_context.fs = '20px'

    context.files_context.curr_filename = req.params.filename
    let filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${context.files_context.curr_filename}`)
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            res.redirect("/")
            return;
        }
        context.files_context.curr_file_val = data

        const filePath = path.join(__dirname, 'filesConfig.json');
        const jsonData = fs.readFileSync(filePath, 'utf8');
        let dataConfig = {};

        if (jsonData) {
            dataConfig = JSON.parse(jsonData);
        }


        if (dataConfig[context.files_context.curr_filename]) {
            context.files_context.bgc = dataConfig[context.files_context.curr_filename].bgc
            context.files_context.c = dataConfig[context.files_context.curr_filename].c
            context.files_context.fs = dataConfig[context.files_context.curr_filename].fs
        }


        res.render('editor.hbs', context)
    });
})

app.get('/saveText', function(req, res) {
    let filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${context.files_context.curr_filename}`)
    let val = req.query.textarea
    fs.writeFile(filepath, val, (err) => {
        if (err) {
            res.redirect("/")
            return
        }
        console.log("ok")
        res.redirect(`/openEditor/${context.files_context.curr_filename}`)
    })
})

app.get('/renameFile', function(req, res) {
    let name = req.query.name
    let ftype = req.query.filetype
    if (req.query.filetype.slice(-4).includes('.')) {
        if (req.query.filetype.slice(-3).includes('.')) {
            ftype = ftype.slice(-2)
        } else {
            ftype = ftype.slice(-3)
        }
    } else {
        ftype = ftype.slice(-4)
    }
    if (name == "" || name == undefined) {
        name = "bez_nazwy"
    }
    let filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${name}.${ftype}`)

    while (fs.existsSync(filepath)) {
        name += "-kopia"
        filepath = path.join(__dirname, `upload${context.current_path.dir}`, `${name}.${ftype}`)
    }

    let OldFilepath = path.join(__dirname, `upload${context.current_path.dir}`, `${context.files_context.curr_filename}`)

    fs.rename(OldFilepath, filepath, (err) => {
        if (err) {
            res.redirect("/")
            return
        }

        let oldName = context.files_context.curr_filename
        context.files_context.curr_filename = name + `.${ftype}`

        const filePath = path.join(__dirname, 'filesConfig.json');
        const jsonData = fs.readFileSync(filePath, 'utf8');
        let data = {};

        if (jsonData) {
            data = JSON.parse(jsonData);
        }

        if (data[oldName]) {
            data[context.files_context.curr_filename] = { "bgc": data[oldName].bgc, "c": data[oldName].c, "fs": data[oldName].fs };


            const updatedData = JSON.stringify(data, null, 5);

            fs.writeFileSync(filePath, updatedData, 'utf8');
        }

        res.redirect(`/openEditor/${context.files_context.curr_filename}`)
    })
})


app.get('/backFromFile', function(req, res) {
    if (context.current_path.dir == "/") {
        res.redirect("/")
    } else {
        res.redirect(`/nextDir/${encodeURIComponent(context.current_path.dir)}`)
    }
})

app.get('/saveSettings', function(req, res) {
    const filePath = path.join(__dirname, 'filesConfig.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    let data = {};

    if (jsonData) {
        data = JSON.parse(jsonData);
    }

    data[req.query.filename] = { "bgc": req.query.backgroundColor, "c": req.query.color, "fs": req.query.fontSize };

    const updatedData = JSON.stringify(data, null, 5);

    fs.writeFileSync(filePath, updatedData, 'utf8');

    res.redirect(`/openEditor/${context.files_context.curr_filename}`);
});

app.get('/showFile', function(req, res) {
    let filePath = path.join(__dirname, `upload${context.current_path.dir}`, `${context.files_context.curr_filename}`)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.redirect('/')
            return;
        }

        res.send(data);
    });
});

/* --- */

app.get('/openImg/:filename', function(req, res) {
    context.img_context.curr_img = req.params.filename
    let p = path.join(__dirname, `upload${context.current_path.dir}`, `${context.img_context.curr_img}`)
    context.img_context.curr_img_path = p

    const filePath = path.join(__dirname, 'filesConfig.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    let data = {};

    if (jsonData) {
        data = JSON.parse(jsonData);
    }

    context.img_context.curr_img_filter = data[context.img_context.curr_img].filter

    res.render('filters.hbs', context);
})

app.get('/saveImg', function(req, res) {

    const filePath = path.join(__dirname, 'filesConfig.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    let data = {};

    if (jsonData) {
        data = JSON.parse(jsonData);
    }

    data[context.img_context.curr_img] = { "filter": req.query.filter };

    const updatedData = JSON.stringify(data, null, 5);

    fs.writeFileSync(filePath, updatedData, 'utf8');

    res.redirect(`/openImg/${context.img_context.curr_img}`)
})

/* --- */

app.listen(PORT, function() {
    console.log("start serwera na porcie " + PORT)
})