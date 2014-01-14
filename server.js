var express = require('express'),
    ejs     = require('ejs'),

var app = module.exports = express()

// This is our very temporary data storage.
var data = [
        {
            body: 'This is a test note- whatever.',
            id: 1388949198827,
            created: 1388949198827,
            updated: 1388949198827,
            viewed: 1388949198827
        },
        {
            body: 'Im going to the park.',
            id: 1388949294616,
            created: 1388949294616,
            updated: 1388949294616,
            viewed: 1388949294616
        },
        {
            body: 'Fetch the default set of models for this collection from the server, setting them on the collection when they arrive.',
            id: 1388949196827,
            created: 1388949196827,
            updated: 1388949196827,
            viewed: 1388949196827
        },
        {
            body: 'The options hash takes success and error callbacks which will both be passed (collection, response, options) as arguments.',
            id: 1388949106827,
            created: 1388949106827,
            updated: 1388949106827,
            viewed: 1388949106827
        },
        {
            body: 'When the model data returns from the server, it uses set to (intelligently) merge the fetched models, unless you pass {reset: true}, in which case the collection will be (efficiently) reset.',
            id: 1388949116827,
            created: 1388949116827,
            updated: 1388949116827,
            viewed: 1388949116827
        },
        {
            body: 'Delegates to Backbone.sync under the covers for custom persistence strategies and returns a jqXHR.',
            id: 1388949126827,
            created: 1388949126827,
            updated: 1388949126827,
            viewed: 1388949126827
        },
        {
            body: 'The server handler for fetch requests should return a JSON array of models.',
            id: 1388949136827,
            created: 1388949136827,
            updated: 1388949136827,
            viewed: 1388949136827
        },
        {
            body: 'The behavior of fetch can be customized by using the available set options.',
            id: 1388949146827,
            created: 1388949146827,
            updated: 1388949146827,
            viewed: 1388949146827
        },
        {
            body: 'For example, to fetch a collection, getting an "add" event for every new model, and a "change" event for every changed existing model, without removing anything: collection.fetch({remove: false})',
            id: 1388949156827,
            created: 1388949156827,
            updated: 1388949156827,
            viewed: 1388949156827
        },
        {
            body: 'jQuery.ajax options can also be passed directly as fetch options, so to fetch a specific page of a paginated collection: Documents.fetch({data: {page: 3}})',
            id: 1388949166827,
            created: 1388949166827,
            updated: 1388949166827,
            viewed: 1388949166827
        },
        {
            body: 'Note that fetch should not be used to populate collections on page load — all models needed at load time should already be bootstrapped in to place.',
            id: 1388949266827,
            created: 1388949266827,
            updated: 1388949266827,
            viewed: 1388949266827
        },
        {
            body: 'fetch is intended for lazily-loading models for interfaces that are not needed immediately: for example, documents with collections of notes that may be toggled open and closed.',
            id: 1388949366827,
            created: 1388949366827,
            updated: 1388949366827,
            viewed: 1388949366827
        },
        {
            body: 'Convenience to create a new instance of a model within a collection.',
            id: 1388940366827,
            created: 1388940366827,
            updated: 1388940366827,
            viewed: 1388940366827
        },
        {
            body: 'Equivalent to instantiating a model with a hash of attributes, saving the model to the server, and adding the model to the set after being successfully created.',
            id: 1388941366827,
            created: 1388941366827,
            updated: 1388941366827,
            viewed: 1388941366827
        },
        {
            body: 'Returns the new model. If client-side validation failed, the model will be unsaved, with validation errors.',
            id: 1388942366827,
            created: 1388942366827,
            updated: 1388942366827,
            viewed: 1388942366827
        },
        {
            body: 'In order for this to work, you should set the model property of the collection.',
            id: 1388943366827,
            created: 1388943366827,
            updated: 1388943366827,
            viewed: 1388943366827
        },
        {
            body: 'The create method can accept either an attributes hash or an existing, unsaved model object.',
            id: 1388943466827,
            created: 1388943466827,
            updated: 1388943466827,
            viewed: 1388943466827
        },
        {
            body: 'Creating a model will cause an immediate "add" event to be triggered on the collection, a "request" event as the new model is sent to the server, as well as a "sync" event, once the server has responded with the successful creation of the model. Pass {wait: true} if youd like to wait for the server before adding the new model to the collection.',
            id: 1388943566827,
            created: 1388943566827,
            updated: 1388943566827,
            viewed: 1388943566827
        },
        {
            body: 'Web applications often provide linkable, bookmarkable, shareable URLs for important locations in the app.',
            id: 1388943666827,
            created: 1388943666827,
            updated: 1388943666827,
            viewed: 1388943666827
        }
    ]

var preferences = {
    page_size: 5
}


// Use Mustache style delimiters so we don't collide with client side templates.
ejs.open  = '{{'
ejs.close = '}}'

// Tell ejs to render .html files
app.engine('.html', require('ejs').__express)

// Needed to parse JSON data sent by Backbone
app.use(express.bodyParser())

// Helper functions
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

function timestamp_now () {
    return (new Date()).getTime()
}

function dataPage (page_num) {
    return data.slice(page_num*preferences.page_size, page_num*preferences.page_size+preferences.page_size)
}

// Hello World example
app.get('/hello', function (req, res) {
    res.send('Hello World')
})

// Template example
app.get('/', function (req, res) {
    res.render('index.html', {
        // initdata: JSON.stringify(data.slice(0, 5))
        initdata: JSON.stringify(dataPage(0))
    })
})

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
    var page = 0
    if (req.query.page) {
        page = req.query.page*1
    }
    res.json(dataPage(page))
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
app.use(express.directory('static'))
app.use(express.static('static'))

// If not being imported by another module, start the server.
if (!module.parent) {
    app.listen(3000)
    console.log('Express started on port 3000')
}
