const express        = require('express');
const router         = express.Router();	
const Log_Details 	 = require('../models/log_details')	
const User = require('../models/user')

exports.signin = function(req, res){
	res.json("signin");
}

exports.dashboard = function(req,res,next){
	//console.log('session' + req.session.username)
	//console.log('auth cookie' , req.cookies.auth_token)
	res.render('dashboard')
}

exports.logout = function(req,res){
	var newLog = Log_Details({
		userid : req.session.userdetails.userid,
		log_type : 'Log_Out',
		log_date : new Date()
	})

	newLog.save(function(err){
		if(err) throw err;
		console.log("login created")
	})
	res.clearCookie('auth_token')
	res.clearCookie('auth_id');
	res.redirect('/')
}

exports.UsersCount = function(req,res){
	User.find({} , 
		'email statusid')
		.exec(function (err, users) {
			if (err) {
				throw err
			}

			if(users != null){
				var io = req.app.get('io');
				var userscount = {
					usersTotal : users.length,
					usersActive : users.filter(e => e.statusid == 1).length,
					usersInactive : users.filter(e => e.statusid == 2).length
				}
				console.log(userscount);
				io.emit('UsersCount', userscount);
			}
		});

}