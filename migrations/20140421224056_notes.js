
exports.up = function(knex, Promise) {
    return knex.schema.createTable('Notes', function (note) {
        note.increments('id').primary()
        note.string('body')
        note.timestamp('createdAt')
        note.timestamp('updatedAt')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('Notes') 
};
