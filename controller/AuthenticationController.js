const User 			 = require('../models/user')
const jwtmodule 	 = require('../jwt/jwtmodule')

var schedule = require('node-schedule');
const Log_Details    = require('../models/log_details')	

var lib = require('../helpers/lib.js');

exports.signin = function(req, res){
	res.clearCookie('auth_id')
	res.render('users/login')
}

exports.validateEmail = function(req,res){
	User.findOne({email: req.body.email_id , statusid : 1} ,  'firstname lastname username')
	.then((user) => {
		if(user == undefined){
			res.status(200).send({msg : 'Failed',userdata : null})
		} else {
			res.status(200).send({msg : 'Success', user : user})
		}
	}).catch((err) => {
		res.status(400).send({msg: err})
	})
}

exports.validatePassword = function(req,res){
	User.findOne({email: req.body.email_id, statusid : 1 } , 'firstname lastname username email roleid password')
	.then((user) => {
		user.comparePassword(req.body.password, (err, isMatch) => {

			if (isMatch && !err) {		
				res.status(200).send({msg : 'Success', user : user})		
			}
			else {
				res.status(200).send({msg : 'Failed',userdata : null})
			}
		})
	}).catch((err) => {
		res.status(400).send({msg: err})
	})
}


exports.checkLogin =  async function(req,res){

	 User.findOne({email: req.body.email_id, statusid : 1 })
	.populate('roleid' , 'rolename description')
	.then((user) => {
		user.comparePassword(req.body.password, (err, isMatch) => {
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

				// req.session.username = user.username
				// req.session.email = user.email
				// req.session.firstname = user.firstname
				// req.session.lastname = user.lastname
				// req.session.role = user.roleid.rolename

				req.session.userdetails = {
					userid : user._id,
					username : user.username,
					email : user.email,
					firstname : user.firstname,
					lastname : user.lastname,
					role : user.roleid.rolename
				}
				//res.cookie('auth_token' , token , {httpOnly : true})

				var newLog = Log_Details({
					userid : user._id,
					log_type : 'Log_In',
					log_date : new Date()
				})

				newLog.save(function(err){
					if(err) throw err;
					console.log("login created")
				})

				//call socket for update log in dashboard
				var io = req.app.get('io');
				lib.getLogInfo().then(function(outData){
					setTimeout(function(){
						io.emit('userlogs', outData);
					},1000)
				})
				res.redirect('/dashboard')			
			}
			else {
				res.status(200).send({msg : 'Failed',userdata : null})
			}
		})
	}).catch((err) => {
		res.status(400).send({msg: err})
	})
}