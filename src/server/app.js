'use strict';
var express = require('express');
var path = require('path');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var jsf = require('json-schema-faker');

var app = express();
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname + '/../../dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
mongoose.Promise = global.Promise;

// Models
var Customer = require('./customer.model.js');
// var Parking = require('./parking.model.js');
var FakeSchema = require('./fakeData.js');

var services = require('./services');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');

  // APIs
  // pricing per user type
  app.post('/company/getPricing', function (req, res) {
    var pricingType = req.body.type;
    if (!Number.isInteger(pricingType)) {return console.error('missing params');}
    var currentPricing = services.getPricing(pricingType);
    // console.log(currentPricing);
    res.status(200).json(currentPricing);
  });

  // select all
  app.get('/customers', function (req, res) {
    Customer.find({}, function (err, docs) {
      if (err) {return console.error(err);}
      res.json(docs);
    });
  });

  // count all
  app.post('/customers/import', function (req, res) {
    var importData = jsf(FakeSchema);
    console.log(importData);
    Customer.insertMany(importData, function (err/*, count*/) {
      if (err) {return console.error(err);}
      res.sendStatus(200);
    });
  });

  // count all
  app.post('/customers/purge', function (req, res) {
    console.log('you\'re about to delete all data...');
    Customer.remove({}, function (err/*, count*/) {
      if (err) {return console.error(err);}
      res.sendStatus(200);
    });
  });

  // create
  app.post('/customer', function (req, res) {
    var obj = new Customer(req.body);
    obj.save(function (err, obj) {
      if (err) {return console.error(err);}
      res.status(200).json(obj);
    });
  });

  // find by id
  app.get('/customer/:id', function (req, res) {
    Customer.findOne({_id: req.params.id}, function (err, obj) {
      if (err) {return console.error(err);}
      res.status(200).json(obj);
    });
  });

  // get invoices by customer id
  app.get('/invoices/:customerId', function (req, res) {
    Customer.findById(req.params.customerId, 'invoices', { lean: true }, function (err, obj) {
      if (err) {return console.error(err);}
      res.status(200).json(obj);
    });
  });

  // create
  app.post('/invoice', function (req, res) {
    var newInvoice = services.generateInvoice(req.body.customer, +req.body.month);
    // $addToSet instead $push to not add duplicate data
    Customer.findOneAndUpdate({_id: req.body.customer._id}, { $addToSet: { invoices: newInvoice}}, { lean: true }, function (err, obj) {
      if (err) {return console.error(err);}
      res.status(200).json(newInvoice);
    });
  });

  // update by id
  app.put('/customer/:id', function (req, res) {
    Customer.findOneAndUpdate({_id: req.params.id}, req.body, function (err) {
      if (err) {return console.error(err);}
      res.sendStatus(200);
    });
  });

  // delete by id
  app.delete('/customer/:id', function (req, res) {
    Customer.findOneAndRemove({_id: req.params.id}, function (err) {
      if (err) {return console.error(err);}
      res.sendStatus(200);
    });
  });


  // all other routes are handled by Angular
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/../../dist/index.html'));
  });

  app.listen(app.get('port'), function () {
    console.log('Angular 2 Full Stack listening on port ' + app.get('port'));
  });
});

module.exports = app;
