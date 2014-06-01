/* jshint node: true */

var express  = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    models   = require('./models'),
    routes   = require('./routes'),
    bcrypt   = require('bcryptjs'),
    hbs      = require('express-hbs')

var app = module.exports = express()

// passport session setup
passport.serializeUser(function (user, done) {
    done(null, user.id)
})
passport.deserializeUser(function (id, done) {
    models.User.findById(id, function (err, user) {
        done(err, user)
    })
})

// use the passport-local strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        models.User.findByUsername(username, function (err, user) {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, { message: 'Unknown user ' + username })
            }
            if (!bcrypt.compareSync(password, user.get('password'))) {
                return done(null, false, { message: 'Invalid password' })
            }
            return done(null, user)
        })
    }
))

// Configure Express
app.set('port', process.env.PORT || 3000)
app.set('dirname', __dirname + '/build')
if (process.env.DEV === 'true') {
    app.set('dirname', __dirname)
}

// Configure templating
var root_url = process.env.ROOT_URL || '/'
hbs.registerHelper('root_url', function () {
    return root_url
})
app.engine('hbs', hbs.express3())
app.set('view engine', 'hbs')
app.set('views', app.get('dirname') + '/views')

// Needed to parse JSON data sent by Backbone
app.use(express.bodyParser())

// For passport authentication
app.use(express.cookieParser())
app.use(express.methodOverride())
app.use(express.session({secret: 'RANDOMSTRING'}))
app.use(passport.initialize())
app.use(passport.session())

// Configure routes
app.use(app.router)
app.get('/', routes.index)

app.post('/note', routes.note.create)
app.get('/note', routes.note.readPage)
app.get('/note/:id', routes.note.readId)
app.put('/note/:id', routes.note.update)
app.delete('/note/:id', routes.note.delete)

app.get('/settings', ensureAuthenticated, routes.user.settings)
app.get('/signin', routes.user.signinPage)
app.post('/signin', function (req, res, next) {
    routes.user.signin(req, res, passport, root_url, next)
})
app.get('/signup', routes.user.signupPage)
app.post('/signup', function (req, res, next) {
    routes.user.signup(req, res, root_url, next)
})
app.get('/signout', routes.user.signout)

// Serve static files
app.use(express.static(app.get('dirname') + '/public'))

// If not being imported by another module, start the server.
if (!module.parent) {
    app.listen(app.get('port'))
    console.log('Express started on port ' + app.get('port'))
}

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect(root_url + 'signin')
}
