var mongoose = require('mongoose');

var parkingSchema = mongoose.Schema({
    time: [{
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
      },
      timeIn: Date,
      timeOut: Date
    }]
    // invoices: Array
    // [{
    //   customerId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Customer'
    //   },
    //   parking: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Parking'
    //   }]
    // }]
});

var Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;
