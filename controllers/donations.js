require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

var stripe = require('stripe')(process.env.STRIPE_KEY)


var monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];

function checkRecurringDonors() {

  console.log("Check Recurring Donors");

  knex('recurring_doners')
  .select('*')
  .then(function(data) {
    // console.log(data);
    var now = new Date();

    var dateToCheck = [
      now.getMonth(),
      now.getDate(),
      now.getYear()
    ]

    var i = 0;
    function checkNext() {
      console.log(data[i]);
      var chargeUser = false;
      var donor, donorStartDate, creationDate;
      if (data[i] !== undefined) {
        donor = JSON.parse(data[i].recurring_donor_data);
        donorStartDate = new Date(donor.billingTimestamp);
        creationDate = [
          donorStartDate.getMonth(),
          donorStartDate.getDate(),
          donorStartDate.getYear(),
        ]
        if (creationDate[1] > monthDays[dateToCheck[0]]) {
          creationDate[1] = monthDays[dateToCheck[0]];
        }
        if (dateToCheck[2] == creationDate[2] && dateToCheck[1] == creationDate[1] && dateToCheck[0] == creationDate[0]) {

          chargeUser = false;

        } else if (dateToCheck[2] != creationDate[2]) {

          if (creationDate[1] == 31 && dateToCheck[1] == 30 && monthDays[dateToCheck[0]-1] == 30) {
            creationDate[1] == 30;
          }
          if (dateToCheck[1] == creationDate[1]) {
            chargeUser = true;
          }
        } else if(dateToCheck[0] != creationDate[0]) {
          if (creationDate[1] == 31 && dateToCheck[1] == 30 && monthDays[dateToCheck[0]-1] == 30) {
            creationDate[1] == 30;
          }
          if (dateToCheck[1] == creationDate[1]) {
            chargeUser = true;
          }
        }
        if (data[i] == undefined) {
          chargeUser = false;
        }
        if (chargeUser) {

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
              console.log("Charge made");
              if (i < data.length) {
                knex('donations')
                .insert({donation_data:JSON.stringify({invoice:donor.invoice,customer:donor.customer})},'id')
                .then(function(data) {
                  var donationId = data[0];
                  knex('users')
                  .where({email:donor.customer.email})
                  .select('*')
                  .then(function(user) {
                    userData = JSON.parse(user[0].user_data);
                    if (userData.donations) {
                      userData.donations.push(donationId);
                    } else {
                      userData.donations = [donationId];
                    }
                    knex('users')
                    .where({email:donor.customer.email})
                    .update({user_data:JSON.stringify(userData)})
                    .then(function() {
                      i++;
                      if (i == data.length-2) {
                        return;
                      } else {
                        checkNext();
                      }
                    })
                  })
                })
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

        } else {
          if (i < data.length-1) {
            i++;
            checkNext();
          } else {
            return;
          }
        }
      } else {
        return;
      }

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
  console.log("Starting Recurring Donor Timer");
  // calc time remaining until the next 4pm
   // get current time
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

function addRecurringDonor(donation, user, res, donationId) {
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
        userID:user.id,
        billingTimestamp: Date.now()
      }
      knex('recurring_doners')
      .insert({recurring_donor_data:JSON.stringify(invoice)},'id')
      .then(function(recDonId) {
        userData = JSON.parse(user[0].user_data);
        if (userData.donations) {
          userData.donations.push([donationId,recDonId]);
        } else {
          userData.donations = [[donationId, recDonId]];
        }
        knex('users')
        .where({email:user[0].email})
        .update({user_data:JSON.stringify(userData)})
        .then(function() {
          res.send('success')
        })
      })
      .catch(function(err) {
        console.log(err);
        // res.send(err);
        return false;
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

exports.createPaymentIntent = async function(req, res, next) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount:req.body.amount,
    currency:'usd',
    payment_method_types: ['card']
  });
  res.send({clientSecret: paymentIntent.client_secret});
}

exports.makeDonation = async function(req, res, next) {


  knex('donations')
  .insert({donation_data:JSON.stringify(req.body.donation)},'id')
  .then(function(data) {
    var donationId = data[0];
    if (req.body.donation.invoice.recurring == true) {
      knex('users')
      .where({email:req.body.donation.email})
      .select('*')
      .then(function(user) {
        addRecurringDonor(req.body.donation, user, res, donationId);
      })
    } else {
      knex('users')
      .where({email:req.body.donation.email})
      .select('*')
      .then(function(user) {
        userData = JSON.parse(user[0].user_data);
        if (userData.donations) {
          userData.donations.push(donationId);
        } else {
          userData.donations = [donationId];
        }
        knex('users')
        .where({email:req.body.donation.email})
        .update({user_data:JSON.stringify(userData)})
        .then(function() {
          res.send('success');
        })
      })
    }
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })

}

exports.addRecurringDonor = function(req, res, next){


}
