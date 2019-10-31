const express        = require('express');
const router         = express.Router();	
const User 			 = require('../models/user')	
const bcrypt 		 = require('bcryptjs')
const jwt 			 = require('jsonwebtoken')
const jwtmodule 	 = require('../jwt/jwtmodule')

var schedule = require('node-schedule');

exports.signin = function(req, res){
	// res.json({Login : "Login Page"})
	res.render('users/login')
}



exports.validateUserName = function(req,res){
	//email: 'jeyalakshmi.r@techmango.net'
	console.log(req.body.email_id)

	User.findOne({email: req.body.email_id} ,  'fullname username roleid password')
	.then((user) => {
		//console.log("user " + user)
		if(user == undefined){
			res.status(200).send({msg : 'Failed',userdata : null})
			//res.json({status : 'Success'})
		} else {
			//res.json({status : 'Failed'})
			res.status(200).send({msg : 'Success', user : user})
		}
	}).catch((err) => {
		console.log(err)
		res.status(400).send({msg: err})
	})
}

exports.validatePassword = function(req,res){
	User.findOne({email: req.body.email_id } , 'id fullname username email roleid password')
	.then((user) => {
		console.log("user " + user)
		user.comparePassword(req.body.password, (err, isMatch) => {

			console.log("isMatch" + isMatch)
			if (isMatch && !err) {		
				res.status(200).send({msg : 'Success', user : user})		
			}
			else {
				console.log('Failed')
				res.status(200).send({msg : 'Failed',userdata : null})
			}
		})
	}).catch((err) => {
		res.status(400).send({msg: err})
	})
}

exports.checkLogin = function(req,res){
	console.log(req.body.email_id , req.body.password)

	User.findOne({email: req.body.email_id } , 'id fullname username email roleid password')
	.then((user) => {
		console.log("user " + user)
		user.comparePassword(req.body.password, (err, isMatch) => {
			console.log("isMatch" + isMatch)
			if (isMatch && !err) {		
				var token = jwtmodule.sign(JSON.parse(JSON.stringify(user)))	
				
				jwtmodule.verify(token , function(err,val) {
				})

				// schedule.scheduleJob('15 * * * * *', function(){
				// 	console.log('These will be executed if second is 15. Eg:7m 15s , 78 15s ');
				// 	// redis.startRedis(function(){
				// 	// 	redis.storeDataAsString("newString" , "mytesting")
				// 	// });
				// 	//redis.startRedis();
				// });

				// redisServer.storeDataAsString("newString" , "mytesting")

				//req.session.username = user.fullname
				res.cookie('auth_token' , token , {httpOnly : true})

				res.redirect('/dashboard')			
			}
			else {
				console.log('Failed')
				res.status(200).send({msg : 'Failed',userdata : null})
			}
		})
	}).catch((err) => {
		res.status(400).send({msg: err})
	})
}