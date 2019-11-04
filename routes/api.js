const express = require('express');
const router = express.Router();
const datasetup = require('../controller/DataSetupController')
const auth = require('../controller/AuthController');
const home = require('../controller/HomeController');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
   // console.log('Time: ', Date.now())
    next()
  })


// router.get('/', function(req, res){
//     res.send('Get route on things.');
//  });
 

// router.post('/', function(req, res){
//    res.send('POST route on things.');
// });

router.get('/datasetup' , datasetup.seedsetup)

router.get('/' ,auth.signin);

router.post('/validateUserName', auth.validateUserName)

router.post('/validatePassword' ,auth.validatePassword)

router.post('/checkLogin', auth.checkLogin )

router.get('/dashboard' , home.dashboard)



//app.route('./datasetup').get(datasetup.seedsetup)

module.exports = router;
