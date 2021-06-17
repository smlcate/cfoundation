require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

var stripe = require('stripe')(process.env.STRIPE_KEY)

function addRecurringDonor(donation, userID, res) {
  const customer = stripe.customers.create({
    name:donation.fullName,
    email:donation.email,
    description: 'Donor to Yellow Bag of Humanity',
  }, function(err, customer) {
    if(err) {
      console.log(err);
      res.send(err);
    } else if(customer) {
      console.log(customer);
      var invoice = {
        customer:customer,
        invoice:donation.invoice,
        userID:userID
      }
      knex('recurring_doners')
      .insert({recurring_donor_data:JSON.stringify(invoice)})
      .then(function() {
        res.send(customer);
      })
      .catch(function(err) {
        console.log(err);
        res.send(err);
      })
    }
  })
}

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
        if (req.body.donation.invoice.recurring == true) {
          knex('users')
          .where({email:req.body.donation.email})
          .select('*')
          .then(function(data) {
            console.log(data);
            addRecurringDonor(req.body.donation, data.id, res);
          })
        } else {
          res.send('success');
        }
      })
      .catch(function(err) {
        console.log(err);
        res.send(err);
      })

    }
  })
}

exports.addRecurringDonor = function(req, res, next){


}
