const User = require('../models/user')
const Role = require('../models/role')

exports.getUserList = function(req,res){
    User.find({_id : {$ne : req.session.userdetails.userid} , statusid : 1} , 
    'firstname lastname email username')
    .populate('roleid' , 'rolename description')
    .exec(function (err, users) {
        if (err) {
            throw err
        }
        res.render('userManagement/userslist', {userslist : users} )
    });
}

exports.getRoleList = function (req,res){
    Role.find({statusid : 1})
    .then((roles) => {
        res.render('userManagement/roleslist', {roleslist : roles} )
    }).catch(err => {
         throw err
    })
}

exports.openUserForm = function(req,res){
    Role.find({statusid : 1} , 'rolename' , function(req, roles){
        if(roles  == null){
           res.status(400).send({msg:"Roles Not Found"})
        } else {
            res.render('userManagement/adduser' , {roleslist : roles} )
        }
    })
}

exports.openRoleForm = function(req,res){
    res.render('userManagement/addrole')
}

exports.userCreation = function(req,res) {
    var newUser = User({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,          
        secretkey : req.body.secretkey,
        accesskey : req.body.accesskey,
        roleid : req.body.drprole
    })

    newUser.save(function(err){
        if(err) throw err;

        res.redirect('/userslist')
    })
}

exports.userRemove = function(req,res){
    var userid = req.body.userid
    User.findOne({_id : userid})
    .exec(function (err, user) {
        user.statusid = 2

        user.save(function(err) {
            if(err) throw err;
            res.status(200).send({msg :"Success"})
        })
    })
}

exports.roleRemove = function(req,res){
    Role.findOne({_id : req.body.roleid})
    .exec(function (err, role) {
        role.statusid = 2

        role.save(function(err) {
            if(err) throw err;
            res.status(200).send({msg :"Success"})
        })
    })
}
exports.userEdit = function(req,res){
    User.findOne({_id : req.body.userid})
    .exec(function (err, user) {
        
        user.firstname = req.body.firstname,
        user.lastname = req.body.lastname,
        user.username = req.body.username,
        //user.email = req.body.email,    
        user.secretkey = req.body.secretkey,
        user.accesskey = req.body.accesskey,
        user.roleid = req.body.drprole

        user.save(function(err){
            if(err) throw err;
            res.redirect('/userslist')
        })     
    });
}

exports.editUser = function(req,res){
    var userid = req.query.id

    User.findOne({_id : userid , statusid : 1})
    .then((user) => {
        Role.find({statusid : 1} , 'rolename')
        .then((roles) => {
            if(user == null){
                res.status(400).send({msg:"User Not Found"})
            } else {
                res.render('userManagement/edituser' , {user : user , roleslist : roles} )
            }
        })
    })
}

exports.validateRole = function(req,res){
    if (req.body.editedroleid){
        Role.findById(req.body.editedroleid , 'rolename')
        .then(role => {
            if(role.rolename.toLowerCase() == req.body.rolename.toLowerCase()){
                res.status(200).send({msg : 'Failed', role : null})
            } else {
                Role.findOne({rolename: new RegExp(`^${req.body.rolename}$`, 'i') , 
                statusid : 1} ,  'rolename')
                .then((role) => {
                    if(role != null){
                        res.status(200).send({msg : 'Success', role : role}) // role exists              
                    } else {
                        res.status(200).send({msg : 'Failed', role : null})
                    }
                })
                .catch((err) => {
                    throw err
                    })
                }
        })
    } else {
        Role.findOne({rolename: new RegExp(`^${req.body.rolename}$`, 'i') , 
        statusid : 1} ,  'rolename')
        .then((role) => {
            if(role != null){
                res.status(200).send({msg : 'Success', role : role}) // role exists              
            } else {
                res.status(200).send({msg : 'Failed', role : null})
            }
        }).catch((err) => {
            throw err
    })   
    }
}

exports.validateUserEmail = function(req,res){
    User.findOne({email: new RegExp(`^${req.body.email_id}$`, 'i') , statusid : 1} , 
    'firstname lastname username')
	.then((user) => {
		if(user == undefined){
			res.status(200).send({msg : 'Failed',userdata : null})
		} else {
			res.status(200).send({msg : 'Success', user : user})
		}
	}).catch((err) => {
		res.status(400).send({msg: err})
	})
}

exports.roleCreation = function(req,res) { 
    var newRole = Role({
        rolename : req.body.rolename,
        description : req.body.description
    });

    newRole.save(function(err){
        if (err) throw err;
        res.redirect('/roleslist')
    })
}

exports.editRole = function(req,res){
    Role.findOne({_id : req.query.id} , 'rolename description')
    .then((role) => {
        res.render('userManagement/editrole' , {role : role})       
    })
    .catch(err =>{
        if(err) throw err;
    })
}

exports.roleEdit = function(req,res){
    Role.findById(req.body.roleid)
    .exec(function (err, role) {
        
        role.rolename = req.body.rolename,
        role.description  = req.body.description

        role.save(function(err){
            if(err) throw err;

            if(req.session.userdetails.roleid == req.body.roleid){
                req.session.userdetails.role = req.body.rolename
            }
            res.redirect('/roleslist')
        })     
    });
}
