// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {

      database: 'cfoundation',
      password: 'ncmpTk88'
    }
    // connection: {
    //   user: 'postgres',
    //   database: 'postgres',
    //   password: 'postgres'
    // }
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
    connection: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },

  }

}
