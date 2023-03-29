require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

exports.postReview = function(req, res, next) {
  console.log(req.body);
  knex('reviews')
  .insert({review_data:JSON.stringify(req.body)})
  .then(function() {
    res.send('success');
  })
  .catch(function(err) {
    console.log(err);
    res.send('error');
  })
}
