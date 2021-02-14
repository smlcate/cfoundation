// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      user: 'postgres',
      database: 'postgres',
      password: 'postgres'
    }
  },

  staging: {
    client: 'pg',
    connection: {
      database: 'postgres',
      // user:     'username',
      password: 'Gabn8899!'
    },
    // pool: {
    //   min: 2,
    //   max: 10
    // },
    // migrations: {
    //   tableName: 'knex_migrations'
    // }
  },

  production: {
    client: 'pg',
    // The next line is where the application will read that environment variable to connect to the database
    connection: process.env.DATABASE_URL,
    // migrations: {
    //     directory: '/migrations',
    // },
    // seeds: {
    //     directory: __dirname + '/db/seeds/production',
    // },
    // client: 'pg',
    // connection: {
    //   database: 'HEROKU_POSTGRESQL_YELLOW',
    //   // user:     'username',
    //   password: 'ncmpTk88'
    // },
    // pool: {
    //   min: 2,
    //   max: 10
    // },
    // migrations: {
    //   tableName: 'knex_migrations'
    // }
  }

}
