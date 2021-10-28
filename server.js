const env = require('dotenv').config({path:'./.env'});

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var server = {
  admin: require('./controllers/admin.js'),
  orders: require('./controllers/orders.js'),
  login: require('./controllers/login.js'),
  donations: require('./controllers/donations.js')
}

app.use(express.static('public'));
app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));

app.post('/saveCarePackagePrice', server.admin.saveCarePackagePrice);
app.get('/getCarePackagePrice', server.admin.getCarePackagePrice);

app.post('/addNewRibbon', server.admin.addNewRibbon);
app.post('/saveRibbonEdit', server.admin.saveRibbonEdit);
app.get('/getRibbons', server.admin.getRibbons);

app.post('/newOrder', server.orders.newOrder);
app.get('/getOrders', server.orders.getOrders);


// app.get('/createCheckoutSession', server.orders.createCheckoutSession);

app.post('/addNewItem', server.admin.addNewItem);
app.post('/editItem', server.admin.editItem);
app.post('/removeItem', server.admin.removeItem);

app.get('/getItems', server.admin.getItems);


app.get('/getUsers', server.login.getUsers);
app.post('/signUp', server.login.signUp);
app.post('/signIn', server.login.signIn);

app.post('/checkPermission', server.login.checkPermission);

app.get('/getDonations', server.donations.getDonations);
app.post('/makeDonation', server.donations.makeDonation);
app.post('/addRecurringDonor', server.donations.addRecurringDonor);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
