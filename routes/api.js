const express = require('express');
const router = express.Router();
const datasetup = require('../controller/DataSetupController')
const auth = require('../controller/AuthenticationController');
const home = require('../controller/HomeController');
const usermanagement = require('../controller/UserManagementContoller')

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
	    next()
})


var isLoggedIn = (req, res, next) => {
  if (req.session.userdetails && 
      req.session.userdetails.username && req.session.userdetails.email) {
      next();
  } else {
      res.redirect('/')
  }
}; 

router.get('/datasetup' , datasetup.seedsetup)

router.get('/' ,auth.signin);

// axios url
router.post('/validateEmail', auth.validateEmail)

router.post('/validatePassword' ,auth.validatePassword)

router.post('/checkLogin', auth.checkLogin )

router.post('/userCreation' , usermanagement.userCreation)

router.post('/userRemove' , usermanagement.userRemove)

router.post('/userEdit' , usermanagement.userEdit)

router.post('/validateRole' , usermanagement.validateRole)

router.post('/roleCreation' , usermanagement.roleCreation)

router.post('/roleRemove' , usermanagement.roleRemove)

router.post('/roleEdit' , usermanagement.roleEdit)

router.post('/validateUserEmail', usermanagement.validateUserEmail)

//--------------------------------------

// address bar url

router.get('/dashboard' , isLoggedIn , home.dashboard)

router.get('/userslist', isLoggedIn , usermanagement.getUserList)

router.get('/adduser', isLoggedIn , usermanagement.openUserForm)

router.get('/edituser',isLoggedIn , usermanagement.editUser)

router.get('/roleslist' , isLoggedIn , usermanagement.getRoleList)

router.get('/addrole' , isLoggedIn , usermanagement.openRoleForm)

router.get('/editrole',isLoggedIn , usermanagement.editRole)

router.get('/logout' , home.logout)
//-----------------------------------------


module.exports = router;
 