/* jshint node: true */

var Bookshelf = require('bookshelf').conn

Bookshelf.Note = Bookshelf.Model.extend({
    tableName: 'Notes',
    hasTimestamps: ['createdAt', 'updatedAt']
})

module.exports = Bookshelf.Note
