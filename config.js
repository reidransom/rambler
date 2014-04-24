module.exports = {
    database: {
        client: 'sqlite',
        connection: {
            filename: process.env.STORAGE || './db/production.sqlite'
        }
    },
    directory: './migrations',
    tableName: 'migrations'
};