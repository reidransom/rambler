
exports.up = function(knex, Promise) {
    return knex.schema.renameTable('Notes', 'Note')
};

exports.down = function(knex, Promise) {
    return knex.schema.renameTable('Note', 'Notes') 
};
