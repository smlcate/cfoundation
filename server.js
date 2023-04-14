const env = require('dotenv').config({path:'./.env'});

var express = require('express');
var compression = require('compression');
var app = express();
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');

const { jsPDF } = require("jspdf");

var server = {
  admin: require('./controllers/admin.js'),
  orders: require('./controllers/orders.js'),
  login: require('./controllers/login.js'),
  donations: require('./controllers/donations.js'),
  profile: require('./controllers/profile.js'),
  reviews: require('./controllers/reviews.js'),
}

app.use(compression());
app.use(express.static('public'));
app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));

app.post('/saveCarePackagePrice', server.admin.saveCarePackagePrice);
app.get('/getCarePackagePrice', server.admin.getCarePackagePrice);

app.post('/addNewRibbon', server.admin.addNewRibbon);
app.post('/saveRibbonEdit', server.admin.saveRibbonEdit);
app.get('/getRibbons', server.admin.getRibbons);

app.get('/getOrders', server.orders.getOrders);
app.post('/newOrder', server.orders.newOrder);

app.post('/batchOrders', server.admin.batchOrders);
app.post('/sendOrders', server.admin.sendOrders);

app.post('/uploadShippingRates', server.admin.uploadShippingRates);
app.get('/getShippingRates', server.admin.getShippingRates);

app.post('/savePackageDimensions', server.admin.savePackageDimensions);
app.get('/getPackageDimensions', server.admin.getPackageDimensions);

app.get('/getTestimonials', server.admin.getTestimonials);
app.post('/addTestimonial', server.admin.addTestimonial);
app.post('/editTestimonial', server.admin.editTestimonial);
app.post('/addFavTestimony', server.admin.addFavTestimony);
app.post('/removeFavTestimony', server.admin.removeFavTestimony);

app.get('/getCategories', server.admin.getCategories);
app.post('/addCategory', server.admin.addCategory);
app.post('/removeCategory', server.admin.removeCategory);

app.get('/getBagPresets', server.admin.getBagPresets);
app.post('/addBagPreset', server.admin.addBagPreset);
app.post('/editBagPreset', server.admin.editBagPreset);

app.get('/getBags', server.admin.getBags);
app.post('/buildBags', server.admin.buildBags);

app.post('/sendBags', server.admin.sendBags);

app.get('/getFulfillments', server.admin.getFulfillments);
app.post('/markBagsAndBatch', server.admin.markBagsAndBatch);

app.post('/buildQRPrints', server.admin.buildQRPrints);

app.post('/addNewItem', server.admin.addNewItem);
app.post('/editItem', server.admin.editItem);
app.post('/removeItem', server.admin.removeItem);

app.get('/getItems', server.admin.getItems);


app.get('/getUsers', server.login.getUsers);
app.post('/signUp', server.login.signUp);
app.post('/signIn', server.login.signIn);
app.post('/requestPasswordReset', server.login.requestPasswordReset);

app.post('/verifyPasswordReset', server.login.verifyPasswordReset);
app.post('/resetPassword', server.login.resetPassword);

app.post('/checkPermission', server.login.checkPermission);

app.post('/createPaymentIntent', server.donations.createPaymentIntent);
app.post('/createOrderPaymentIntent', server.orders.createOrderPaymentIntent);

app.get('/getDonations', server.donations.getDonations);
app.post('/makeDonation', server.donations.makeDonation);
app.post('/addRecurringDonor', server.donations.addRecurringDonor);

app.post('/endRecPledge', server.profile.endRecPledge);
app.post('/updateRecPledge', server.profile.updateRecPledge);

app.post('/getUsersDonations', server.profile.getUsersDonations);

app.get('/getReviews', server.reviews.getReviews);
app.post('/postReview', server.reviews.postReview);
app.post('/editReview', server.reviews.editReview);
app.post('/addFavReview', server.admin.addFavReview);
app.post('/removeFavReview', server.admin.removeFavReview);

app.get('/getFeedbackController', server.reviews.getFeedbackController);

app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
