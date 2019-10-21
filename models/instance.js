// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var instanceSchema =  Schema({
    instancename: String,
    description : String,
    statusid: Number,
    created_at: Date,
    updated_at: Date
});

//
// on every save, add the date
instanceSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
  
    // change the updated_at field to current date
    this.updated_at = currentDate;

    this.statusid = 1
  
    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;
  
    next();
  });

// the schema is useless so far
// we need to create a model using it
var Instance = mongoose.model('Instance', instanceSchema);
// make this available to our users in our Node applications
module.exports = Instance;