var jsf = require('json-schema-faker');
var moment = require('moment');

jsf.extend('faker', function(faker) {
  // faker.locale = "de"; // or any other language
  faker.custom = {
    dateBetween: function(month, day, start, end) {
      return faker.date.between('2017-' + month + '-' + day + ' ' + start, '2017-' + month + '-' + day + ' ' + end);
    }
  };
  return faker;
});

// http://json-schema-faker.js.org/#gist/2a33e6eb4bae0b1d4d4cd0aa241d66cf
var FakeSchema = {
  "type": "array",
  "minItems": 3,
  "maxItems": 6,
  "items": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "faker": "name.findName"
      },
      "email": {
        "type": "string",
        "format": "email",
        "faker": "internet.email"
      },
      "premium": {
        "type": "boolean"
      },
      "parking": {
        "type": "array",
        "items": (function() {
          var sequentialDates = [];
          for (var i = 0; i < 15; i++) {
            var m = i < 5 ? 2 : 3;
            sequentialDates.push({
              "type": "object",
              "properties": {
                "timeIn": {
                  "format": "date-time",
                  "type": "string",
                  "faker": {
                    "custom.dateBetween": [m, i+1, "06:00", "13:00"]
                  }
                },
                "timeOut": {
                  "format": "date-time",
                  "type": "string",
                  "faker": {
                    "custom.dateBetween": [m, i+1, "15:00", "21:00"]
                  }
                }
              },
              "required": ["timeIn", "timeOut"]
            })
          }

          return sequentialDates;
        })()
        // "minItems": 2,
        // "maxItems": 6,
        // "type": "object",
        // "properties": {
        //   "timeIn": {
        //     "format": "date-time",
        //     "type": "string",
        //     "faker": {
        //       "date.between": ["2017-03-01 11:00", "2017-03-01 20:00"]
        //     }
        //   },
        //   "timeOut": {
        //     "format": "date-time",
        //     "type": "string",
        //     "faker": {
        //       "date.between": ["2017-03-01 17:00", "2017-03-01 22:00"]
        //     }
        //   },
        //   "timeStart": {
        //     "type": "string",
        //       "faker": {
        //         "custom.timeStart": [20]
        //       }
        //   }
        // },
        // "required": ["timeIn", "timeOut"]
      },
      "invoices": {
        "type": "array",
        "items": []
      }
    },
    "required": ["name", "email", "premium", "parking", "invoices"]
  }
};
module.exports = FakeSchema;
