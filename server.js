require('dotenv').config();

// var pg = require('pg');

var express = require('express');
var app = express();
// var knex = require('./db/knex');
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
