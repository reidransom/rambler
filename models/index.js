/* jshint node: true */

var Bookshelf = require('bookshelf'),
    config    = require('../config')

Bookshelf.conn = Bookshelf.initialize(config.database)

module.exports      = Bookshelf.conn
module.exports.User = require('./user')
module.exports.Note = require('./note')
