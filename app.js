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




var server  = app.listen(3200,function(){
    console.log("Server running");
})


var io = require('socket.io').listen(server);


//Routing
const apiRoute= require('./routes/api');
const auth = require('./controller/AuthenticationController');
const service = require('./controller/ServiceController');
app.use('/' , apiRoute); //.get(auth.signin);
app.route('/getServer').post(service.getServer);
app.route('/getCpuStatistics').post(service.getCpuStatistics);
app.route('/clearRedis').get(service.clearRedis);
app.route('/getJenkins').post(service.getJenkins);
app.set('io', io);
