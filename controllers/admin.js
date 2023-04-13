require('dotenv').config();
var express = require('express');
var app = express();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

const randomString = require('randomstring');

const fs = require('fs');
const PDFDocument = require('pdfkit');

const { jsPDF } = require("jspdf");

exports.savePackageDimensions = function(req, res, send) {
  knex('package_dimensions')
  .insert({package_dimensions_data:req.body})
  .then(function() {
    res.send('success')
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}

exports.getPackageDimensions = function(req, res, send) {
  knex('package_dimensions')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}

exports.uploadShippingRates = function(req, res, send) {
  console.log(req.body);
  knex('shippingRates')
  .insert({shippingRate_data:req.body})
  .then(function() {
    res.send('success')
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.getShippingRates = function(req, res, send) {
  knex('shippingRates')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}

exports.addTestimonial = function(req, res, send) {

  knex('testimonials')
  .insert({testimonial_data:req.body.testimonial_data}, 'id')
  .then(function(data) {
    console.log(data);
    res.send({id:data[0]});
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
exports.addFavTestimony = function(req, res, send) {
  knex('feedback_controller')
  .select('*')
  .then(function(data) {
    if (data.length > 0) {
      controller = JSON.parse(data[0].feedback_controller_data);
      controller.favTestimonies.push(req.body.id);
      knex('feedback_controller')
      .where({id:1})
      .update({
        feedback_controller_data:JSON.stringify(controller)
      })
      .then(function() {
        res.send('success');
      })
    } else {
      controller = {
        favTestimonies:[req.body.id],
        favReviews:[]
      }
      knex('feedback_controller')
      .insert({feedback_controller_data:JSON.stringify(controller)})
      .then(function() {
        res.send('success');
      })
      .catch(function(err) {
        console.log(err);
        res.send('error');
      })
    }
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.removeFavTestimony = function(req, res, send) {
  knex('feedback_controller')
  .select('*')
  .then(function(data) {
    controller = JSON.parse(data[0].feedback_controller_data);
    let filteredNumbers = controller.favTestimonies.filter(id => id !== req.body.id);
    knex('feedback_controller')
    .where({id:1})
    .update({
      feedback_controller_data:JSON.stringify(controller)
    })
    .then(function() {
      res.send('success');
    })

  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
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

exports.addFavReview = function(req, res, send) {
  knex('feedback_controller')
  .select('*')
  .then(function(data) {
    if (data.length > 0) {
      let controller = JSON.parse(data[0].feedback_controller_data);
      controller.favReviews.push(req.body.id);
      knex('feedback_controller')
      .where({id:1})
      .update({
        feedback_controller_data:JSON.stringify(controller)
      })
      .then(function() {
        knex('reviews')
        .where({id:req.body.id})
        .select('*')
        .then(function(data) {
          let review = JSON.parse(data[0].review_data);
          review.favorite = true;
          knex('reviews')
          .where({id:req.body.id})
          .update({review_data:JSON.stringify(review)})
          .then(function() {
            res.send('success');
          })
          .catch(function(err) {
            console.log(err);
            res.send(err);
          })
        })
        .catch(function(err) {
          console.log(err);
          res.send(err);
        })

      })
      .catch(function(err) {
        console.log(err);
        res.send(err);
      })
    } else {
      let controller = {
        favTestimonies:[],
        favReviews:[req.body.id]
      }
      knex('feedback_controller')
      .insert({feedback_controller_data:JSON.stringify(controller)})
      .then(function() {
        res.send('success');
      })
      .catch(function(err) {
        console.log(err);
        res.send('error');
      })
    }
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.removeFavReview = function(req, res, send) {
  knex('feedback_controller')
  .select('*')
  .then(function(data) {
    controller = JSON.parse(data[0].feedback_controller_data);
    let filteredNumbers = controller.favReviews.filter(id => id !== req.body.id);
    knex('feedback_controller')
    .where({id:1})
    .update({
      feedback_controller_data:JSON.stringify(controller)
    })
    .then(function() {
      knex('reviews')
      .where({id:req.body.id})
      .select('*')
      .then(function(data) {
        let review = JSON.parse(data[0].review_data);
        review.favorite = false;
        knex('reviews')
        .where({id:req.body.id})
        .update({review_data:JSON.stringify(review)})
        .then(function() {
          res.send('success');
        })
        .catch(function(err) {
          console.log(err);
          res.send(err);
        })
      })
      .catch(function(err) {
        console.log(err);
        res.send(err);
      })

    })

  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
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
exports.getBagPresets = function(req, res, send) {
  knex('bag_presets')
  .select('*')
  .then(function(data) {
    res.send(data)
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.addBagPreset = function(req, res, send) {
  knex('bag_presets')
  .insert({bag_preset_data:JSON.stringify(req.body)})
  .then(function(data) {
    res.send(data)
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.editBagPreset = function(req, res, send) {
  knex('bag_presets')
  .where({id:req.body.id})
  .update({bag_preset_data:JSON.stringify(req.body.preset)})
  .then(function() {
    res.send('success')
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.buildBags = function(req, res, send) {
  var iteration = 0;
  function adjustQuantities(body){
    knex('items')
    .where({id:req.body.items[iteration].id})
    .select('*')
    .then(function(data) {
      var item = JSON.parse(data[0].itemData);
      item.quantity -= body.quantity;
      knex('items')
      .where({id:req.body.items[iteration].id})
      .update({itemData:JSON.stringify(item)})
      .then(function() {
        if (iteration == body.items.length-1) {
          res.send('success');
        } else {
          iteration ++;
          adjustQuantities(body);
        }
      })
      .catch(function(err) {
        console.log(err);
      })
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  function addBag(body) {
    var bag = body;
    var uid = randomString.generate(10);
    bag.uid = uid;
    bag.status = 'built';
    knex('bags')
    .insert({bag_data:JSON.stringify(bag)})
    .then(function() {
      if (iteration == bag.quantity-1) {
        iteration = 0;
        adjustQuantities(body);
      } else {
        iteration ++;
        addBag(body);
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  addBag(req.body)
}
exports.getBags = function(req, res, send) {
  knex('bags')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.getFulfillments = function(req, res, send) {
  knex('fulfillments')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.markBagsAndBatch = function(req, res, send) {
  var bags = req.body;
  const now = new Date();
  var iteration = 0;
  function batch(bags) {
    var batchReceipt = {
      bags: bags,
      batched_timestamp: now,
      fulfilled_timestamp: null
    }
    knex('fulfillments')
    .insert({fulfillment_data: batchReceipt},'*')
    .then(function(data) {
      console.log('batched');
      res.send(data)
    })
    .catch(function(err) {
      console.log(err);
      res.send(err);
    })

  }
  function markBag(bags) {
    knex('bags')
    .select('*')
    .where({id:bags[iteration].id})
    .update({bag_data: JSON.stringify(bags[iteration].bag_data)})
    .then(function() {
      if (iteration == bags.length-1) {
        console.log('marked');
        batch(bags);
      } else {
        iteration ++;
        markBag(bags);
      }
    })
    .catch(function(err) {
      console.log(err);
      res.send(err);
    })
  }
  markBag(bags)
}
exports.sendBags = function(req, res, send) {
  var bags = req.body.bags;
  var iteration = 0;
  function markBag(bags) {
    knex('bags')
    .select('*')
    .where({id:bags[iteration].id})
    .update({bag_data: JSON.stringify(bags[iteration].bag_data)})
    .then(function() {
      if (iteration == bags.length-1) {
        console.log('marked');
        knex('fulfillments')
        .where({id:req.body.receipt.id})
        .select('*')
        .then(function(data) {
          data[0].fulfillment_data = JSON.parse(data[0].fulfillment_data);
          var fulfilled = true;
          for (var i = 0; i < bags.length; i++) {
            if (bags[i].bag_data.status != 'sent') {
              fulfilled = false;
            }
            for (var j = 0; j < data[0].fulfillment_data.bags.length; j++) {
              if (bags[i].id == data[0].fulfillment_data.bags[j].id) {
                data[0].fulfillment_data.bags[j] = bags[i]
              }
              if (i == bags.length - 1 && j == data[0].fulfillment_data.bags.length - 1) {
                if (fulfilled == true) {
                  const now = new Date();
                  data[0].fulfillment_data.fulfilled_timestamp = now;

                }
                knex('fulfillments')
                .where({id:data[0].id})
                .update({fulfillment_data: JSON.stringify(data[0].fulfillment_data)})
                .then(function() {
                  res.send('success');
                })
                .catch(function(err) {
                  console.log(err);
                  res.send(err);
                })
              }
            }
          }
        })
        .catch(function(err) {
          console.log(err);
          res.send(err);
        })
      } else {
        iteration ++;
        markBag(bags);
      }
    })
    .catch(function(err) {
      console.log(err);
      res.send(err);
    })
  }
  markBag(bags)
}
exports.buildQRPrints = function(req, res) {
  var qrCodeImages = req.body;
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 36;
  const qrCodeSize = 200;
  const qrCodesPerPage = 6;
  const doc = new PDFDocument({
    size: [pageWidth, pageHeight],
    margins: { top: margin, bottom: margin, left: margin, right: margin }
  });

  let pageNumber = 1;
  let x = margin;
  let y = margin;

  for (let i = 0; i < qrCodeImages.length; i++) {
    if (i % qrCodesPerPage === 0 && i !== 0) {
      doc.addPage();
      pageNumber++;
      x = margin;
      y = margin;
    }

    if (x + qrCodeSize > pageWidth - margin) {
      x = margin;
      y += qrCodeSize + margin;
    }

    doc.image(qrCodeImages[i], x, y, { width: qrCodeSize });
    x += qrCodeSize + margin;
  }

  const chunks = [];
  doc.on('data', (chunk) => {
    chunks.push(chunk);
  });

  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=QR_Codes.pdf');
    console.log(pdfBuffer);
    const base64 = pdfBuffer.toString('base64');
    res.send(base64);
  });

  doc.end();
};

exports.batchOrders = function(req, res, next) {
  var iteration = 0;
  function markOrder(orders) {
    console.log(orders);
    knex('orders')
    .where({id:orders[iteration].id})
    .update({orderData:JSON.stringify(orders[iteration].orderData)})
    .then(function() {
      if (iteration == orders.length-1) {
        res.send('success');
      } else {
        iteration ++;
        markOrder(orders);
      }
    })
    .catch(function(err) {
      console.log(err);
      res.send(err);
    })
  }
  markOrder(req.body);
}
exports.sendOrders = function(req, res, next) {
  var iteration = 0;
  function markOrder(orders) {
    console.log(orders);
    knex('orders')
    .where({id:orders[iteration]})
    .select('*')
    .then(function(data) {
      var order = JSON.parse(data[0].orderData);
      order.status = 'sent';
      knex('orders')
      .where({id:orders[iteration]})
      .update({orderData:JSON.stringify(order)})
      .then(function() {
        if (iteration == orders.length-1) {
          res.send('success');
        } else {
          iteration ++;
          markOrder(orders);
        }
      })
      .catch(function(err) {
        console.log(err);
        res.send(err);
      })
    })
    .catch(function(err) {
      console.log(err);
      res.send(err);
    })
  }
  markOrder(req.body);
}
exports.getCategories = function(req, res, send) {
  knex('item_categories')
  .select('*')
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.addCategory = function(req, res, send) {
  console.log(req.body);
  knex('item_categories')
  .insert({category_data:req.body})
  .then(function() {
    res.send('success');
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
  })
}
exports.removeCategory = function(req, res, send) {
  console.log(req.body);
  knex('item_categories')
  .where({id:req.body.id})
  .delete()
  .then(function() {
    res.send('success');
  })
  .catch(function(err) {
    console.log(err);
    res.send(err);
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
