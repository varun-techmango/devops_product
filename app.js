const express = require('express');
const bodyParser = require("body-parser");
const mongoose      = require('mongoose');
const path = require('path');
const http = require('http');
const https = require('https');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const expressSession = require('express-session');
const async = require('async');

const uuid = require('uuid/v4')
const config = require('./config.json')
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


const auth = require('./controller/AuthenticationController');
const service = require('./controller/ServiceController');

// var redis = require('redis');
// var client = redis.createClient();


var connString = config.development.dialect + '://' 
+ config.development.host + ':' 
+ config.development.port + '/'
+ config.development.database

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(expressSession({
    resave: false,
    saveUninitialized: true,
    secret: 'eeuqram',
    key: 'auth_id',
    cookie: { maxAge: null ,httpOnly :true , path : '/' } 
}));

app.use(cookieParser())

app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

mongoose.set('useNewUrlParser' , true);
mongoose.set('useUnifiedTopology' , true)
mongoose.set('useCreateIndex', true);

mongoose.connect(connString , 
function(err, client) {

    // let isConnected = !!client && !!client.topology && client.topology.isConnected()
    if (err == null){
        console.log("Connected successfully to mongodb") 
    } else {
        console.log("Please Run mongodb")
    }
}
)

app.use(function(req,res ,next){
  res.locals.userdetails = req.session.userdetails
  next();
})




var server  = app.listen(3012,function(){
    console.log("Server running");
})


var io = require('socket.io').listen(server);


//Routing
const apiRoute= require('./routes/api');
app.use('/' , apiRoute); //.get(auth.signin);
app.route('/getServer').post(service.getServer);
app.route('/getJenkins').post(service.getJenkins);

/*io.on('connection', function (socket) {
    console.log("Socket Connected");
    //console.log(socket);
   socket.on('message', function (data) {
    console.log("Emitted");
        io.emit('send', data);
    });
});

*/

app.set('io', io);
