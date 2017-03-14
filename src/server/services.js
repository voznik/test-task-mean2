'use strict';

var _ = require('lodash');
var moment = require('moment');

var Pricing = [
  {
    am: 1.50,
    pm: 1.00,
    monthlyFee: 0,
    monthlyGap: 0
  }, {
    am: 1.00,
    pm: 0.75,
    monthlyFee: 20,
    monthlyGap: 30
  }
];

exports.getPricing = function (pricingType) {
  return Pricing[pricingType];
};

exports.generateInvoice = function (customer, selectedMonth) {
  var invoice = { 'num': selectedMonth},
    customerType = customer.premium
      ? 1
      : 0,
    currentPricing = this.getPricing(customerType);
  console.log(moment('# month for 9 park time is', customer.parking[8].timeIn).month());
  // filter parking times by selected month
  var filteredParking = _.filter(customer.parking, function (item) {
    return moment(item.timeIn).month() === selectedMonth;
  });
  // pack parking times & calculate cost
  invoice.parking = _.map(filteredParking, function (times) {
    // moment stuff
    var tIn = moment(times.timeIn);
    var tOut = moment(times.timeOut);

    if (tIn.format('a') === 'am' && tOut.format('a') === 'am') { // is only AM time
      times.tDiffAM = times.totalMinutes = tOut.diff(tIn, 'minutes');
      times.totalCost = Math.ceil(times.tDiffAM / 30) * currentPricing.am + currentPricing.monthlyFee;
    } else if (tIn.format('a') === 'pm' && tOut.format('a') === 'pm') { // is only PM time
      times.tDiffPM = times.totalMinutes = tOut.diff(tIn, 'minutes');
      times.totalCost = Math.ceil(times.tDiffPM / 30) * currentPricing.pm + currentPricing.monthlyFee;
    } else {
      // var t12 = tIn.set({'hour': 12, 'minute': 0});
      var t12 = moment(times.timeIn).set({'hour': 11, 'minute': 59});
      times.tDiffAM = t12.diff(tIn, 'minutes');
      times.tDiffPM = tOut.diff(t12, 'minutes');
      times.totalCost = Math.ceil(times.tDiffAM / 30) * currentPricing.am + Math.ceil(times.tDiffPM / 30) * currentPricing.pm + currentPricing.monthlyFee;
    }
    // helper values
    times.tDiff = tOut.diff(tIn);
    times.tDiffDur = moment.duration(times.tDiff);
    times.totalMinutes = Math.round(times.tDiffDur.asMinutes());
    times.totalHours = times.tDiffDur.asHours();
    return times;
  });
  // total values
  invoice.totalMinutes = invoice.parking.reduce(function (a, b) {
    return a + b['totalMinutes'];
  }, 0);
  invoice.subTotal = invoice.parking.reduce(function (a, b) {
    return a + b['totalCost'];
  }, 0);
  invoice.totalCost = (customerType === 1 && invoice.subTotal > 300)
    ? 300
    : invoice.subTotal;

  return invoice; // customer.invoices.push(invoice);
};
