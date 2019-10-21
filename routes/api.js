const express = require('express');
const router = express.Router();
const http = require('http');	
const app = express();

app.route('/').get(auth.signin);

module.exports = router;
