require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');



exports.checkUid = function(req, res, next) {
  res.send('success')
}

exports.getReviews = function(req, res, next) {
  knex('reviews')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
  })
}

exports.editReview = function(req, res, next) {
  knex('reviews')
  .where({id:req.body.id})
  .update({review_data:req.body.data})
  .then(function() {
    res.send('success')
  })
  .catch(function(err) {
    console.log(err);
    res.send('error');
  })
}

exports.postReview = function(req, res, next) {
  knex('reviews')
  .insert({review_data:req.body})
  .then(function() {
    res.send('success');
  })
  .catch(function(err) {
    console.log(err);
    res.send('error');
  })
}

exports.getFeedbackController = function(req, res, next) {
  knex('feedback_controller')
  .select('*')
  .then(function(data) {
    if (data.length == 0) {
      res.send('Empty');
    } else {
      res.send(data[0])
    }
  })
  .catch(function(err) {
    console.log(err);
    res.send('error');
  })
}
