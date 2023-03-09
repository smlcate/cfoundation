// Update with your config settings.

const fs = require('fs');
const ca = fs.readFileSync('./db/ca-certificate.crt');

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
    // connection: process.env.DATABASE_URL,
    // ssl: true,
    connection: {
      host: 'db-postgresql-xgamesmode-do-user-13719415-0.b.db.ondigitalocean.com',
      port: 25060, // replace with your database port number
      user: 'samcate',
      password: 'AVNS_-qEcuLSdmSxxZPusNEN',
      database: 'defaultdb',
      ssl: {
        ca
      }
    }
  }

}
