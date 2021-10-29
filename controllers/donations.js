require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

var stripe = require('stripe')(process.env.STRIPE_KEY)


var monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];

function checkRecurringDonors() {

  knex('recurring_doners')
  .select('*')
  .then(function(data) {

    var now = new Date();

    var dateToCheck = [
      now.getMonth(),
      now.getDate(),
      now.getYear()
    ]

    var i = 0;
    function checkNext() {
      var charge = false;
      var donor = JSON.parse(data[i].recurring_donor_data);
      var donorStartDate = new Date(donor.billingTimestamp);

      var creationDate = [
      donorStartDate.getMonth(),
      donorStartDate.getDate(),
      donorStartDate.getYear(),
      ]

      if (dateToCheck[2] != creationDate[2]) {
        if (creationDate[1] == 31 && dateToCheck[1] == 30 && monthDays[dateToCheck[0]-1] == 30) {
          creationDate[1] == 30;
        }
        if (dateToCheck[1] == creationDate[1]) {
          charge = true;
        }
      } else if(dateToCheck[0] != creationDate[0]) {
        if (creationDate[1] == 31 && dateToCheck[1] == 30 && monthDays[dateToCheck[0]-1] == 30) {
          creationDate[1] == 30;
        }
        if (dateToCheck[1] == creationDate[1]) {
          charge = true;
        }
      }
      stripe.charges.create({
        amount: donor.invoice.total*100,
        currency: "usd",
        customer: donor.customer.id,
        description: "example charge for donations"
      }, function(err, charge) {
        // asynchronously called
        if (err) {

          console.log(err);

        } else if(charge) {
          if (i < data.length-1) {
            i++;
            checkNext();
          } else {
            return;
          }
        } else {
          if (i < data.length-1) {
            i++;
            checkNext();
          } else {
            return;
          }
        }
      })
    }
    if (data.length > 0) {
      checkNext();
    } else {
      return;
    }
  })
  .catch(function(err) {
    console.log(err);
  })

}
function recurringChargeTimer(hr) {

  // calc time remaining until the next 4pm
   // get current time
   console.log('Timer started');
   var now = new Date();

   // create time at the desired hr
   var then = new Date(now);
   then.setHours(hr);
   then.setMinutes(0);
   then.setSeconds(0);
   then.setMilliseconds(0);

   // correct for time after the hr where we need to go to next day
   if (now.getHours() >= hr) {
       then = new Date(then.getTime() + (24 * 3600 * 1000));    // add one day
   }

   // set timer to fire the amount of time until the hr
   setTimeout(function() {
       // alert(msg);
       // set it again for the next day
       checkRecurringDonors()
       recurringChargeTimer(16);
   }, then - now);

}
// checkRecurringDonors();
recurringChargeTimer(16);

function addRecurringDonor(donation, userID, res) {
  const customer = stripe.customers.create({
    name:donation.fullName,
    email:donation.email,
    description: 'Donor to Yellow Bag of Humanity',
    source:'tok_visa'
  }, function(err, customer) {
    if(err) {
      console.log(err);
      res.send(err);
    } else if(customer) {
      var invoice = {
        customer:customer,
        invoice:donation.invoice,
        userID:userID,
        billingTimestamp: Date.now()
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
    amount: req.body.donation.invoice.total*100,
    currency: "usd",
    // source: 'tok_visa', // obtained with Stripe.js
    description: "Yellow Bag Donation"
  }, function(err, charge) {
    // asynchronously called
    if (err) {

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
