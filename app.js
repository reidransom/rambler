var express = require('express'),
    ejs     = require('ejs'),
    db      = require('./models'),
    routes  = require('./routes'),
    note    = require('./routes/note'),
    path    = require('path')

var app = module.exports = express()

var preferences = {
        page_size: 5
    }

app.set('port', process.env.PORT || 3000)

app.set('buildroot', path.join(__dirname, 'build'))
if (process.env.DEV === 'true') {
    app.set(__dirname)
}

// Configure server side templating.
//
// Use Mustache style delimiters so we don't collide with client side templates.
app.set('views', path.join(app.get('buildroot'), 'views'))
app.set('view engine', 'ejs')
ejs.open  = '{{'
ejs.close = '}}'

// Needed to parse JSON data sent by Backbone
app.use(express.bodyParser())

app.use(app.router)

app.use(express.static(path.join(app.get('buildroot'), 'public')))

app.get('/', routes.index)
app.post('/note', note.create)
app.get('/note', note.readPage)
app.get('/note/:id', note.readId)
app.put('/note/:id', note.update)
app.delete('/note/:id', note.delete)

// If not being imported by another module, start the server.
if (!module.parent) {
    db
        .sequelize
        .sync()  // Add `{force: true}` to erase data and update model schemas.
        .complete(function (err) {
            if (err) {
                throw err
            }
            else {
                app.listen(app.get('port'))
                console.log('Express started on port ' + app.get('port'))
            }
        })
}
