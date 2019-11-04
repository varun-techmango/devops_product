const User = require('../models/user')
const Role = require('../models/role')

exports.getList = function(req,res){

    User.find({} , 'firstname lastname email username')
    .populate('roleid' , 'rolename description')

    .exec(function (err, users) {
        if (err) {
            console.log(err)
        }

        res.render('userManagement/userslist', {userslist : users} )
    });
}

exports.openUserForm = function(req,res){
    Role.find({} , 'rolename' , function(req, roles){
        if(roles  == null){
           res.status(400).send({msg:"Roles Not Found"})
        } else {
            res.render('userManagement/adduser' , {roleslist : roles} )
        }
    })
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

        console.log("User Created")
        res.redirect('/userslist')
    })
}

exports.userRemove = function(req,res){
    var userid = req.body.userid
    User.deleteOne({_id : userid} , function(err){
        if(err) throw err;
        res.status(200).send({msg :"Success"})
    })
}

exports.userEdit = function(req,res){
    var userid = req.body.userid
}

exports.roleCreation = function(req,role) {
    Role.findOne({rolename : req.body.rolename} , function(req, role){
        if(role  == null){
            var newRole = Role({
                rolename : req.body.rolename,
                description : req.body.description,
                statusid : req.body.statusid
            });

            newRole.save(function(err){
                if (err) throw err;

                console.log("Role Created");
            })
            
        } else {
            res.status(400).send({msg:"Role already exists"})
        }
    })

}