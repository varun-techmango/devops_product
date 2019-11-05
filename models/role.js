// grab the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
var roleSchema =  Schema({
  rolename: String,
  description : String,
  statusid: Number,
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
roleSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
  
    // change the updated_at field to current date
    this.updated_at = currentDate;

    if(!this.statusid){
      this.statusid = 1;
    }
  
    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;
  
    next();
  });

// the schema is useless so far
// we need to create a model using it
var Role = mongoose.model('Role', roleSchema);
// make this available to our users in our Node applications
module.exports = Role;