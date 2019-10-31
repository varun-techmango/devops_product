const express        = require('express');
const router         = express.Router();	
const http = require('http');		
exports.getServer = function(req, res){
	console.log(req.params.slug);
}

