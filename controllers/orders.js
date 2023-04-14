require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

var stripe = require('stripe')(process.env.STRIPE_KEY)

exports.createOrderPaymentIntent = async function(req, res, next) {
  var amnt;
  await knex('carePackageItemSettings')
  .select('*')
  .then(function(data) {
    amnt = data[0].settingsData*100;
  })
  const paymentIntent = await stripe.paymentIntents.create({
    amount:amnt,
    currency:'usd',
    payment_method_types: ['card']
  });
  res.send({clientSecret: paymentIntent.client_secret});
}

exports.newOrder = function(req, res, send) {
  req.body.order.timestamp = new Date();
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
