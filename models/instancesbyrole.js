// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var instanceroleSchema =  Schema({
  roleid: { type: Schema.Types.ObjectId, required: true , ref : 'Role'}, 
  instanceid: { type: Schema.Types.ObjectId, required: true , ref : 'instance'}, 
  statusid: Number
});

// on every save, add the date
instanceroleSchema.pre('save', function(next) {
    // get the current date
   // var currentDate = new Date();
  
    // change the updated_at field to current date
    this.statusid = 1;
  
    // // if created_at doesn't exist, add to that field
    // if (!this.created_at)
    //   this.created_at = currentDate;
  
    next();
  });

// the schema is useless so far
// we need to create a model using it
var InstanceByRole = mongoose.model('InstanceByRole', instanceroleSchema);
// make this available to our users in our Node applications
module.exports = InstanceByRole;