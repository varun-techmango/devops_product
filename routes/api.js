const express = require('express');
const router = express.Router();
const datasetup = require('../controller/DataSetupController')
const auth = require('../controller/AuthenticationController');
const home = require('../controller/HomeController');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
  })

router.get('/datasetup' , datasetup.seedsetup)

router.get('/' ,auth.signin);

router.post('/validateUserName', auth.validateUserName)

router.post('/validatePassword' ,auth.validatePassword)

router.post('/checkLogin', auth.checkLogin )

router.get('/dashboard' , home.dashboard)

module.exports = router;
