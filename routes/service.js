const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/getServer/:slug', function(req, res, next) {
  res.io.emit("send", "users");
  res.send('respond with a resource.');
});

module.exports = router;