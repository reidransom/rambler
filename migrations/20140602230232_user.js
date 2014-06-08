
exports.up = function(knex, Promise) {
    return knex.schema.renameTable('Users', 'User')
};

exports.down = function(knex, Promise) {
    return knex.schema.renameTable('User', 'Users') 
};
