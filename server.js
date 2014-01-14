var express = require('express'),
    ejs     = require('ejs')

var data = [
        {
            body: 'This is a test note- whatever.',
            id: 1388949198827,
            created: 1388949198827,
            updated: 1388949198827,
            viewed: 1388949198827
        },
        {
            body: 'Im going to the park with baby Cash.',
            id: 1388949294616,
            created: 1388949294616,
            updated: 1388949294616,
            viewed: 1388949294616
        }
    ]

function timestamp_now () {
    return (new Date()).getTime()
}

var app = module.exports = express()

// Use Mustache style delimiters so we don't collide with client side templates.
ejs.open  = '{{'
ejs.close = '}}'

// Tell ejs to render .html files
app.engine('.html', require('ejs').__express)

app.use(express.bodyParser())

app.get('/', function (req, res) {
    res.render('index.html', {
        testdata: 'Hello from grunt-express3'
    })
})

// Hello
app.get('/hello', function (req, res) {
    res.send('Hello World')
})

function indexOfNoteID (id) {
    for (var i = 0; i < data.length; i += 1) {
        if (data[i].id == id) {
            return i
        }
    }
}

function getNoteById (id) {
    return data[indexOfNoteID(id)]
}

// CREATE note
// todo: validate input
app.post('/note', function (req, res) {
    var note = req.body
    note.id = timestamp_now()
    data.push(note)
    res.json({id: note.id})
})

// READ notes
app.get('/note', function (req, res) {
    res.json(data)
})

// READ note
app.get('/note/:id', function (req, res) {
    res.json(getNoteById(req.params.id))
})

// UPDATE note
// todo: validate input
app.put('/note/:id', function (req, res) {
    var update = req.body
    update.id = req.params.id
    data[indexOfNoteID(update.id)] = update
})

// DELETE note
app.delete('/note/:id', function (req, res) {
    var i = indexOfNoteID(req.params.id)
    data.splice(i, 1)
})

// Serve static files
app.use(express.directory('src'))
app.use(express.static('src'))

// If not being imported by another module, start the server.
if (!module.parent) {
    app.listen(3000)
    console.log('Express started on port 3000')
}
