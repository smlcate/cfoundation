const env = require('dotenv').config({path:'./.env'});

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var server = {
  admin: require('./controllers/admin.js'),
  orders: require('./controllers/orders.js')
}

app.use(express.static('public'));
app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));

app.post('/saveCarePackagePrice', server.admin.saveCarePackagePrice);
app.get('/getCarePackagePrice', server.admin.getCarePackagePrice);

app.post('/addNewRibbon', server.admin.addNewRibbon);
app.get('/getRibbons', server.admin.getRibbons);

app.post('/newOrder', server.orders.newOrder);
app.get('/getOrders', server.orders.getOrders);


// app.get('/createCheckoutSession', server.orders.createCheckoutSession);

app.post('/addNewItem', server.admin.addNewItem);
app.post('/editItem', server.admin.editItem);
app.post('/removeItem', server.admin.removeItem);

app.get('/getItems', server.admin.getItems);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
