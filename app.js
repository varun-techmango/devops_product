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
const apiRoute= require('./routes/api')
const uuid = require('uuid/v4')
const config = require('./config.json')
const app = express();
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
    saveUninitialized: false,
    secret: uuid('abcdefghijklmnopqrestuwxyz'),
    key: 'auth_id',
    cookie: { maxAge: 3600000 } 
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
        console.log(err)
    }
}
)

// client.on('connect', function() {
//     console.log('Redis client connected');
// });

// client.on('error', function (err) {
//     console.log('Something went wrong ' + err);
// });

//Routing
app.use('/' , apiRoute) //.get(auth.signin);

app.listen(3200,function(){
	console.log("Server running");
})

