require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

var stripe = require('stripe')(process.env.STRIPE_KEY)

exports.getDonations = function(req, res, next) {
  knex('donations')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
  })
}

exports.makeDonation = function(req, res, next) {

  stripe.charges.create({
    amount: req.body.donation.invoice.total,
    currency: "usd",
    source: 'tok_visa', // obtained with Stripe.js
    description: "example charge for donations"
  }, function(err, charge) {
    // asynchronously called
    if (err) {

      console.log(err);
      res.send(err);

    } else if(charge) {

      knex('donations')
      .insert({donation_data:JSON.stringify(req.body.donation)})
      .then(function() {
        res.send('success');
      })
      .catch(function(err) {
        console.log(err);
        res.send(err);
      })

    }
  })
}
