/* jshint node: true */

var path      = require('path'),
    lodash    = require('lodash'),
    Bookshelf = require('bookshelf')

Bookshelf.conn = Bookshelf.initialize({
    client: 'sqlite',
    connection: {
        filename: process.env.STORAGE || path.join(__dirname, '..', 'ramble.sqlite')
    }
})

var User = require('./user'),
    Note = require('./note')

module.exports = lodash.extend({
    Note: Note,
    User: User
}, Bookshelf.conn)
