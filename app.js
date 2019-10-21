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

const auth = require('./controller/AuthController');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');

//Routing

app.route('/').get(auth.signin);


app.listen(3200,function(){
	console.log("listening...");
})
