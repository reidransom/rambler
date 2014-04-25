/* This file is used only by `./node_modules/knex/bin/knex migrate:[task]`
 *
 * See <https://github.com/tgriesser/knex/blob/master/bin/readme.md>
 */
module.exports = {
    database: {
        client: 'sqlite',
        connection: {
            filename: process.env.STORAGE || './production.sqlite'
        }
    },
    directory: './migrations',
    tableName: 'migrations'
};
