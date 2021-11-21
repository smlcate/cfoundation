require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

exports.getUsersDonations = async function(req, res, next) {
  function runIt() {

    knex('users')
    .select('user_data')
    .where({id:req.body.id})
    .then(function(data) {
      console.log(data);
      var donations = JSON.parse(data[0].user_data).donations;
      console.log(donations);
      var donationData = [];
      var i = 0;
      function iterateDonations() {
        var thisId;
        if (donations[i].length == 2) {
          thisId = donations[i][0];
        } else {
          thisId = donations[i];
        }
        knex('donations')
        .where({id:thisId})
        .select('*')
        .then(function(data) {
          console.log('data',data);
          var don = {
            reg:data[0],
            rec:null
          }
          if (donations[i].length == 2) {
            knex('recurring_doners')
            .where({id:Number(donations[i][1])})
            .select('*')
            .then(function(data) {
              don.rec = data[0];
              donationData.push(don);
              console.log(i, donations.length);
              if (i == donations.length - 1) {
                console.log('hit');
                res.send(donationData);
              } else {
                i++;
                iterateDonations();
              }
            })
          } else {
            donationData.push(don);
            console.log(i, donations.length);
            if (i == donations.length - 1) {
              console.log('hit');
              res.send(donationData);
            } else {
              i++;
              iterateDonations();
            }

          }
        })
        .catch(function(err) {
          console.log(err);
        })
      };
      iterateDonations();
    })
    .catch(function(err) {
      console.log(err);
      res.send(err);
    })

  }
  if (req.body.id && req.body.id != null) {
    runIt();
  } else {
    knex('users')
    .select('id')
    .where({email:req.body.email})
    .then(function(data) {
      console.log(data);
      req.body.id = data[0].id;
      runIt();
    })

  }
  console.log(req.body);

}

exports.endRecPledge = function(req, res, next) {
  console.log(req.body.donation);
  knex("recurring_doners")
  .where({id:req.body.donation.rec.id})
  .delete()
  .then(function() {
    res.send('success');
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}

exports.updateRecPledge = function(req, res, next) {
  console.log(req.body);
  res.send('success');
}
