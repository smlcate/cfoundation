require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

exports.addNewItem = function(req, res, send) {
  knex('items')
  .insert({itemData:JSON.stringify(req.body.item)})
  .then(function() {
    res.send('success')
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.getItems = function(req, res, send) {
  knex('items')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
