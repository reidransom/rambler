/* jshint node: true */

var Bookshelf = require('bookshelf').conn,
    bcrypt = require('bcryptjs'),
    _ = require('lodash'),
    User

User = Bookshelf.Model.extend({
    tableName: 'User',
    hasTimestamps: ['createdAt', 'updatedAt']
}, {
    createUser: function (values, next) {
        bcrypt.hash(values.password, 10, function (err, hash) {
            Bookshelf.knex('User').insert({
                username: values.username,
                email:    values.email,
                password: hash
            })
            .exec(function (err, id) {
                if (err) {
                    if (err.hasOwnProperty('clientError')) {
                        if (err.clientError.errno === 19) {
                            return next(null, null, {message: 'Username already exists.'})
                        }
                    }
                    // Raise unknown error
                    return next(err, null, null)
                }
                else {
                    new User({id: id[0]})
                    .fetch()
                    .then(function (user) {
                        console.log(user)
                        return next(null, user, null)
                    })
                }
            })
        })
    },
    findById: function (id, next) {
        new this({id: id})
            .fetch()
            .then(function (user) {
                next(null, user)
            })
    },
    findByUsername: function (username, next) {
        new this({username: username})
            .fetch()
            .then(function (user) {
                next(null, user)
            })
    }
})

module.exports = Bookshelf.User = User
