var seeder = require('mongoose-seed')
var roledata = require('../seeders/role.json').data
var userdata = require ('../seeders/user.json').data
var instancedata = require ('../seeders/instance.json').data
var Role = require('../models/role')
var Instance = require('../models/instance')
var instancebyroledata = require('../seeders/instancebyrole.json').data
var config = require('../config.json')
var bcrypt = require('bcryptjs')

exports.seedsetup = function (req,res) {
        console.log("seed setup");
        var connString = config.development.dialect + '://' 
                        + config.development.host + ':' 
                        + config.development.port + '/'
                        + config.development.database

        seeder.connect(connString, function() {

        console.log("Connected successfully to mongodb");

        // Role.countDocuments({}, function(err, c) {
        //     console.log('Count is ' + c);
        // });

        // Load Mongoose models
        seeder.loadModels([
            'models/role.js',
            'models/user.js',
            'models/instance.js',
            'models/instancesbyrole'
        ]);

        // Clear specified collections
        seeder.clearModels(['User','Role','Instance','InstanceByRole'], function() {       
            // Callback to populate DB once collections have been cleared
            // Create role and instances 
            var commondata = roledata.concat(instancedata)
            seeder.populateModels(commondata, function() {            
                // create a new user  
                Role.find({rolename : 'Admin'}, function(err, role) {
                    if (err) throw err;
                    
                    var newUser = userdata  
                    
                    newUser[0].documents[0].roleid = role[0].id
                    //newUser[0].documents[0].password =  bcrypt.hashSync(newUser[0].documents[0].password, bcrypt.genSaltSync(10), null);

                    seeder.populateModels(newUser, function(){
                        console.log('User Populated')
                    })

                    Instance.find({statusid : 1}, function(err, instances) {

                        var results = []
                        instances.forEach(element => {
                            var result = {}
                            result['roleid'] = role[0].id
                            result['instanceid'] = element.id
                            results.push(result)
                            //console.log(element)
                        });
                        instancebyroledata[0].documents = results

                        console.log(instancebyroledata[0].documents)

                        seeder.populateModels(instancebyroledata , function() {
                            console.log('Instacne by role Populated')
                        })
                    })

                });            
            });
        });
    });

    res.json('Data Setup Completed')
}
