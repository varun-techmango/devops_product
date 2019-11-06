const express        = require('express');
const router         = express.Router();	
const users 			 = require('../models/user')	
const logDetails    = require('../models/log_details')	
console.log("file included");

// helpers.js
module.exports = {
  getLogInfo: function() {
  console.log("called"); 
  		logDetails.find({})
		 	  .populate('userid' , 'firstname lastname roleid statusid')
		 	  .then((userData) => {
		 	  	return userData;
		 });

  }
}