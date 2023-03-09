// const fs = require('fs');
// const ca = fs.readFileSync('./ca-certificate.crt');

var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile')[environment];
module.exports = require('knex')(config);
