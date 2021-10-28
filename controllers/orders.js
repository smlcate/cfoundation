require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

var stripe = require('stripe')(process.env.STRIPE_KEY)


exports.newOrder = function(req, res, send) {
  knex('carePackageItemSettings')
  .select('*')
  .then(function(data) {
    stripe.charges.create({
      amount: Number(data[0].settingsData)*100,
      currency: "usd",
      source: 'tok_visa', // obtained with Stripe.js
      description: "example charge for memberships"
    }, function(err, charge) {
      // asynchronously called
      if (err) {

        console.log(err);
        res.send(err);

      } else if(charge) {

        knex('orders')
        .insert({orderData:JSON.stringify(req.body.order)})
        .then(function() {
          res.send('success');
        })
        .catch(function(err) {
          console.log(err);
          res.send(err);
        })

      }
    })

  })
  .catch(function(err) {
    console.log(err);
  })
}

exports.getOrders = function(req, res, next) {
  knex('orders')
  .select('*')
  .then(function(data) {
    res.send(data)
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
