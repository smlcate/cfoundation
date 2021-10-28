var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

var bcrypt = require('bcrypt');
var crypto = require('crypto');

var stripe = require('stripe')(process.env.STRIPE_KEY)

exports.signUp = function(req, res, next) {

  console.log(req.body);
  var auth = req.body.auth;

  var user = {
    user_data: {
      fullName:auth.fullName,
      permission:null
    },
    email:auth.email
  }

  const saltRounds = 10;
  const plainTextPassword = auth.password;

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(plainTextPassword, salt, function(err, hash) {
      // Store hash in your password DB.
      user.hashed_passcode = hash;
      knex('users')
      .insert(user)
      .then(function(){
        knex('users')
        .where({email:auth.email})
        .select('*')
        .then(function(data) {

          knex('users')
          .select('*')
          .then(function(allUsers) {

            user.id = data[0].id;
            console.log(data.length);
            if (allUsers.length == 1) {
              user.user_data.permission = 'wonderBreadtree55';
              knex('users')
              .where({id:user.id})
              .update(user)
              .then(function() {
                res.send(user);
              })
              .catch(function(err) {
                console.log(err);
                res.send(err);
              })
            } else {
              res.send(user);
            }

          })
        })
        .catch(function(err) {
          console.log(err);
        })
      })
      .catch(function(err) {
        console.log(err);
      })

    });
  });




}

exports.signIn = function(req, res, next) {
  console.log(req.body);
  var auth = req.body.auth;
  var login;
  knex('users')
  .select('*')
  .where({email:auth.email})
  .then(function(data) {
    console.log('data', data);
    console.log('auth',auth);
    if (data.length == 0) {
      res.send({success:false, message:'Account does not exist'})
    } else {

      bcrypt.compare(auth.password, data[0].hashed_passcode, function(err, acc) {
        if (err) {
          console.log(err);
          res.send(err);
        } else if(acc) {
          console.log(res);
          if (acc === true) {

            user = {
              email: data[0].email,
              fullName:JSON.parse(data[0].user_data).fullName,
              id:data[0].id
            }
            res.send(user)

          } else {
            res.send(acc)
          }
        } else {
          // response is OutgoingMessage object that server response http request
          res.send({success: false, message: 'passwords do not match'});
        }
      });

    }
    // res.send(login)
    // bcrypt.compare(auth.password,data.hashed_passcode,function(err, res) {
    //   // res.send(rec);
    //   // console.log(res);
    //   if (err) {
    //     console.log(err);
    //     res.send(err)
    //   } else if(res) {
    //     console.log(res);
    //     res.send(res)
    //   } else {
    //     // response is OutgoingMessage object that server response http request
    //     return res.send({success: false, message: 'passwords do not match'});
    //   }
    // })

  })
  // .then(function() {
  //   res.send(login);
  //
  // })

}

exports.checkPermission = function(req, res, next) {
  knex('users')
  .where({email:req.body.user.email})
  .then(function(data) {
    console.log(JSON.parse(data[0].user_data));
    if (JSON.parse(data[0].user_data).permission == 'wonderBreadtree55') {
      console.log('hit');
      res.send('allow');
    } else {
      res.send('deny');
    }
  })
}

exports.getUsers = function(req, res, next) {
  console.log(req.body);
  knex('users')
  .select('*')
  .then(function(data) {
    console.log(data);
    var list = [];
    for (var i = 0; i < data.length; i++) {
      list.push(data[i]);
      // if (data[i].membership != null) {
      //   data[i].hashed_passcode = 'not displayed'
      //   list.push(data[i])
      // }
    }
    res.send(list)
  })
}
