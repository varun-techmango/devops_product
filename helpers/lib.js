const express        = require('express');
const router         = express.Router();	
const users 			 = require('../models/user')	
const logDetails    = require('../models/log_details')	
console.log("file included");

// helpers.js
module.exports = {
  getLogInfo: function() {
	return new Promise((resolve, reject) => {
		logDetails.find({})
		 	  .populate('userid' , 'firstname lastname roleid statusid')
		 	  .then((userData) => {
				resolve(userData);
		 }).catch(function(e){reject(e)});
	});
  }
}
