
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
var logSchema =  Schema({
  userid: { type: Schema.Types.ObjectId, required: true , ref : 'User'},
  log_type: String,
  log_details : JSON,
  log_date: Date
});

var Log_Details = mongoose.model('Log_Details', logSchema);
module.exports = Log_Details;