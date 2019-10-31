const express        = require('express');
const router         = express.Router();		
exports.signin = function(req, res){
	res.json("signin");
}

exports.dashboard = function(req,res){
	console.log('session' + req.session.username)
	console.log('auth cookie' , req.cookies.auth_token)
	
	res.render('dashboard')
}

