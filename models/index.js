/* jshint node: true */

var path      = require('path'),
    lodash    = require('lodash'),
    Bookshelf = require('bookshelf')

console.log('storage: ' + process.env.STORAGE)

Bookshelf.conn = Bookshelf.initialize({
    client: 'sqlite',
    connection: {
        filename: process.env.STORAGE || path.join(__dirname, '..', 'ramble.sqlite')
    }
})

var User = require('./user'),
    Note = require('./note')

if (!module.parent) {
    console.log('hi there')
}

var initTables = function (next) {
    User.initTable(function () {
        Note.initTable(function () {
            next()
        })
    })
}

module.exports = lodash.extend({
    Note: Note,
    User: User,
    initTables: initTables
}, Bookshelf.conn)

// module.exports = Bookshelf
