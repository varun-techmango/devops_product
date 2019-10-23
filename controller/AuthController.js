const express        = require('express');
const router         = express.Router();	
const User 			 = require('../models/user')	
const bcrypt 		 = require('bcryptjs')
const jwt 			 = require('jsonwebtoken')
exports.signin = function(req, res){
	// res.json({Login : "Login Page"})
	res.render('users/login')
}

exports.validateUserName = function(req,res){
	//email: 'jeyalakshmi.r@techmango.net'
	//console.log(req.body.email_id)

	User.findOne({email: req.body.email_id} ,  'fullname username roleid password')
	.then((user) => {
		//console.log("user " + user)
		if(user == undefined){
			res.status(200).send({msg : 'Failed',userdata : null})
			//res.json({status : 'Success'})
		} else {
			//res.json({status : 'Failed'})
			res.status(200).send({msg : 'Success'})
		}
	}).catch((err) => {
		res.status(400).send({msg: err})
	})
}

exports.checkLogin = function(req,res){
	console.log(req.body.email_id , req.body.password)

	let encryptedpassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);
	console.log(encryptedpassword)

	User.findOne({email: req.body.email_id } , 'fullname username email roleid password')
	.then((user) => {
		console.log("user " + user)
		user.comparePassword(req.body.password, (err, isMatch) => {

			console.log("isMatch" + isMatch)
			if (isMatch && !err) {

				var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'authsecret', {expiresIn: '24h'}); //24hr
				jwt.verify(token, 'authsecret', function (err, data) {
					console.log("token" + token)
				}); 

				// jwt.decode(token , 'authsecret' , function(err , data){
				// 	console.log("decodedata" +data)
				// })

				console.log("user " + user)
				if(user == undefined){
					res.status(200).send({msg : 'Failed',userdata : null})
					//res.json({status : 'Success'})
				} else {
					console.log("Dsahboard Paage")
					//res.json({status : 'Failed'})
					//res.status(200).send({msg : 'Success',userdata : user})
					res.redirect('/dashboard')
				}
			}
		})
	}).catch((err) => {
		res.status(400).send({msg: err})
	})
}

exports.dashBoard = function(req,res){
	res.render('main/dashboard')
}