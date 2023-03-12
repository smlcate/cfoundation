// Update with your config settings.

const fs = require('fs');
const ca = fs.readFileSync('./db/ca-certificate.crt');
console.log(process.env.DATABASE_URL);
console.log(process.env);

console.log('Knex configuration loaded:', process.env.NODE_ENV);
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
      host: process.env.HOSTNAME,
      port: 25060, // replace with your database port number
      user: process.env.DOUser,
      password: process.env.DOPass,
      database: process.env.DODb,
      ssl: {
        ca
      }
    },
    migrations: {
      directory: './migrations'
    },
    pool: {
      min: 2,
      max: 100
    }
  }

}
