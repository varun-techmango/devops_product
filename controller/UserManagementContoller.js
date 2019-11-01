const User = require('../models/user')
const Role = require('../models/role')

exports.getList = function(req,res){

    User.find({} , 'firstname lastname email username')
    .populate('roleid' , 'rolename description')

    .exec(function (err, users) {
        if (err) {
            console.log(err)
        }

        console.log("users" + users);
        res.render('userManagement/userslist', {userslist : users} )
    });
}

exports.openUserForm = function(req,res){
    res.render('userManagement/adduser' )
}

exports.userCreation = function(req,res) {

    //TODO - Email Validation.
    //TODO - User is exists or not.
    //TODO - 

    console.log("usercreation" + res)

    // User.findOne({email : req.body.email_id} , function(req,user){
    //     if (user == null){
    //         var newUser = User({
    //             email : req.body.email_id,
    //             password : req.body.password,
    //             firstname : req.body.firstname,
    //             lastname : req.body.lastname,
    //             roleid : req.body.roleid
    //         })

    //         newUser.save(function(err){
    //             if(err) throw err;

    //             console.log("User Created")
    //         })
    //     } else {
    //         res.status(400).send({msg : "The User already exists"})
    //     }

    // })
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