require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

exports.getUsersDonations = async function(req, res, next) {
  console.log(req.body);
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
