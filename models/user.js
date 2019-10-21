// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs')

// create a schema
var userSchema =  Schema({
  fullname: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roleid: { type: Schema.Types.ObjectId, required: true , ref : 'Role'}, 
  created_at: Date,
  updated_at: Date
});

//
// on every save, add the date
userSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
  
    // change the updated_at field to current date
    this.updated_at = currentDate;

    this.statusid = 1;

    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
  
    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;
  
    next();
  });

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);
// make this available to our users in our Node applications
module.exports = User;