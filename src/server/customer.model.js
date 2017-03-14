var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    // id: Number,
    name: String,
    email: String,
    premium: Boolean,
    parking: [{
      timeIn: Date,
      timeOut: Date
    }],
    invoices: Array
});

var Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;

// customerId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'Customer'
// },
