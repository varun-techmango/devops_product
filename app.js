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
const apiRoute= require('./routes/api')

const app = express();
//var cors = require('cors');
const auth = require('./controller/AuthController');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

mongoose.set('useNewUrlParser' , true);
mongoose.set('useUnifiedTopology' , true)
mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://localhost:27017/devops" , 
function(err, client) {
    console.log("Connected successfully to mongodb")}    
)

//Routing
app.use('/' , apiRoute) //.get(auth.signin);

app.listen(3200,function(){
	console.log("Server running");
})

