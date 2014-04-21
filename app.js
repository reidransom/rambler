/* jshint node: true */

var path = require('path')

process.env.STORAGE = path.join(__dirname, 'db', 'production.sqlite')

var express  = require('express'),
    ejs      = require('ejs'),
    engine   = require('ejs-locals'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    models   = require('./models'),
    routes   = require('./routes'),
    note     = require('./routes/note'),
    bcrypt   = require('bcryptjs')

var app = module.exports = express()

// Passport session setup
passport.serializeUser(function (user, done) {
    done(null, user.id)
})
passport.deserializeUser(function (id, done) {
    models.User.findById(id, function (err, user) {
        done(err, user)
    })
})

// Use the passport-local strategy
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
app.set('dirname', path.join(__dirname, 'build'))
if (process.env.DEV === 'true') {
    app.set('dirname', __dirname)
}
app.engine('ejs', engine)
app.set('views', path.join(app.get('dirname'), 'views'))
app.set('view engine', 'ejs')

// Use Mustache style delimiters so we don't collide with client side templates.
ejs.open  = '<?'
ejs.close = '?>'

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
app.get('/', ensureAuthenticated, routes.index)
app.post('/note', note.create)
app.get('/note', note.readPage)
app.get('/note/:id', note.readId)
app.put('/note/:id', note.update)
app.delete('/note/:id', note.delete)

app.get('/account', ensureAuthenticated, function(req, res) {
    res.render('account', {user: req.user})
})
app.get('/login', function (req, res) {
    res.render('login', {user: req.user, message: req.session.messages})
})
app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            req.session.messages = [info.message]
            return res.redirect('/login')
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err)
            }
            return res.redirect('/')
        })
    })(req, res, next)
})
app.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
})

// Serve static files
app.use(express.static(path.join(app.get('dirname'), 'public')))

// If not being imported by another module, start the server.
if (!module.parent) {
    app.listen(app.get('port'))
    console.log('Express started on port ' + app.get('port'))
}

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}
