const Log_Details 	 = require('../models/log_details')	

exports.signin = function(req, res){
	res.json("signin");
}

exports.dashboard = function(req,res){
	console.log('session' + req.session.username)
	console.log('auth cookie' , req.cookies.auth_token)
	
	res.render('dashboard')
}

exports.logout = function(req,res){
	var newLog = Log_Details({
		userid : req.session.userdetails.userid,
		log_type : 'Log_In',
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