/* jshint node: true */

var Bookshelf = require('bookshelf').conn,
    bcrypt = require('bcryptjs'),
    _ = require('lodash')

var initial_user = {
        username: 'admin',
        password: 'password'
    }

var User = Bookshelf.Model.extend({
    tableName: 'Users',
    hasTimestamps: ['createdAt', 'updatedAt']
})

User.initTable = function (next) {
    Bookshelf.knex.schema.hasTable('Users').then(function (exists) {
        if (exists) {
            next()
        }
        else {
            Bookshelf.knex.schema.createTable('Users', function (user) {
                user.increments('id')
                user.string('username').unique()
                user.string('password')
                user.timestamp('createdAt')
                user.timestamp('updatedAt')
            }).then(function () {
                User.createUser(initial_user, next)
            })
        }
    })
}

/*
    values is a dict with attributes:
        username (required)
        password (required)
*/
User.createUser = function (values, next) {
    bcrypt.hash(values.password, 10, function (err, hash) {
        User.forge({
            username: values.username,
            password: hash
        })
            .save()
            .then(function () {
                console.log('Created initial user "' + values.username + '".')
                next()
            })
    })
}

User.findById = function (id, next) {
    new this({id: id})
        .fetch()
        .then(function (user) {
            next(null, user)
        })
}

User.findByUsername = function (username, next) {
    new this({username: username})
        .fetch()
        .then(function (user) {
            next(null, user)
        })
}

module.exports = Bookshelf.User = User
