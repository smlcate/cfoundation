require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

exports.addTestimonial = function(req, res, send) {

  knex('testimonials')
  .insert({testimonial_data:req.body.testimonial_data})
  .then(function() {
    res.send('success');
  })
  .catch(function(err) {
    console.log(err);
    res.send('error');
  })

}

exports.editTestimonial = function(req, res, send) {

  knex('testimonials')
  .where({id:req.body.id})
  .update({testimonial_data:req.body.testimonial_data})
  .then(function() {
    res.send('success');
  })
  .catch(function(err) {
    console.log(err);
    res.send('error');
  })

}

exports.removeTestimonial = function(req, res, send) {

  knex('testimonials')
  .where({id:req.body.id})
  .delete()
  .then(function() {
    res.send('success');
  })
  .catch(function(err) {
    console.log(err);
    res.send('error');
  })

}

exports.getTestimonials = function(req, res, send) {

  knex('testimonials')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
    res.send('error');
  })

}

exports.saveCarePackagePrice = function(req, res, send) {
  knex('carePackageItemSettings')
  .where({id:1})
  .select('*')
  .then(function(data) {
    if (data.length > 0) {
      knex('carePackageItemSettings')
      .where({id:1})
      .update({settingsData:JSON.stringify(req.body.price)})
      .then(function() {
        res.send('success')
      })
      .catch(function(err) {
        console.log(err);
        res.send(err);
      })
    } else {
      knex('carePackageItemSettings')
      .insert({settingsData:JSON.stringify(req.body.price)})
      .then(function() {
        res.send('success')
      })
      .catch(function(err) {
        console.log(err);
        res.send(err);
      })
    }
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })

}
exports.getCarePackagePrice = function(req, res, send) {
  knex('carePackageItemSettings')
  .where({id:1})
  .select('*')
  .then(function(data) {
    res.send(data)
  })
  .catch(function(err) {
    console.log(err);
  })
}
exports.addNewItem = function(req, res, send) {
  knex('items')
  .insert({itemData:JSON.stringify(req.body.item)})
  .then(function() {
    res.send('success')
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.editItem = function(req, res, send) {
  knex('items')
  .where({id:req.body.item.id})
  .update({itemData:JSON.stringify(req.body.item)})
  .then(function() {
    res.send('success')
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.removeItem = function(req, res, send) {
  knex('items')
  .where({id:req.body.item.id})
  .delete()
  .then(function() {
    res.send('success')
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}

exports.getItems = function(req, res, send) {
  knex('items')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}

exports.addNewRibbon = function(req, res, next) {
  knex('ribbons')
  .insert({ribbonData:JSON.stringify(req.body.ribbon)})
  .then(function(){
    res.send('success')
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.saveRibbonEdit = function(req, res, next) {
  knex('ribbons')
  .where({id:req.body.ribbon.id})
  .update({ribbonData:JSON.stringify(req.body.ribbon.ribbonData)},)
  .then(function(){
    res.send('success')
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}

exports.getRibbons = function(req, res, next) {
  knex('ribbons')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
