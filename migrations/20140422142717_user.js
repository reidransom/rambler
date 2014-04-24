
exports.up = function(knex, Promise) {
    return knex.schema.createTable('Users', function (table) {
        table.increments('id').primary()
        table.string('username').unique()
        table.string('email')
        table.string('password')
        table.timestamps()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('Users') 
};
