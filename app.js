const express = require('express');
const bodyParser = require("body-parser");
const mongoose      = require('mongoose');
const path = require('path');
const http = require('http');
const https = require('https');
var cookieParser = require('cookie-parser');
const ejs = require('ejs');
const session = require('express-session');
const async = require('async');

const app = express();
//var cors = require('cors');

/*
var AWS = require('aws-sdk'); 

AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIARJ23SX375NCFN7F3";
AWS.config.secretAccessKey = "CZzNneD7qEhGC5DahsA7MNL4ApMI87dCsaWarrvQ+";
AWS.config.region = "us-east-2";

var ec2 = new AWS.EC2();

console.log(ec2);


/*var params = {
  InstanceIds: [  
    'i-0b6ff5de7bb425cf9',
  ],
  Force: true
};
ec2.stopInstances(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});*/




const auth = require('./controller/AuthController');
const service = require('./controller/ServiceController');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

//Routing

app.route('/').get(auth.signin);


app.route('/getServer/:slug').get(service.getServer);



app.listen(3200,function(){
	console.log("listening...");
})
