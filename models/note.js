/* jshint node: true */

var Bookshelf = require('bookshelf').conn

Bookshelf.Note = Bookshelf.Model.extend({
    tableName: 'Notes',
    hasTimestamps: ['createdAt', 'updatedAt']
})

Bookshelf.Note.initTable = function (next) {
    Bookshelf.knex.schema.hasTable('Notes').then(function (exists) {
        if (exists) {
            next()
        }
        else {
            Bookshelf.knex.schema.createTable('Notes', function (note) {
                note.increments('id')
                note.string('body')
                note.timestamp('createdAt')
                note.timestamp('updatedAt')
            }).then(next)
        }
    })
}

module.exports = Bookshelf.Note
