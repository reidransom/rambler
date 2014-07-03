// Update with your config settings.

var environments = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: __dirname + '/data/dev.sqlite'
    }
  },

  testing: {
    client: 'sqlite3',
    connection: {
      filename: __dirname + '/data/testing.sqlite'
    }
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: '/home/reidransom/webapps/rambler_stage/rambler.sqlite'
    }
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: '/home/reidransom/webapps/rambler/rambler.sqlite'
    }
  }

};

module.exports = {
    database: environments[process.env.NODE_ENV || 'development']
}