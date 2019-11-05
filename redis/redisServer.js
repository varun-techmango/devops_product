var redis = require('redis');
var redisClient = redis.createClient();
redisClient.on('connect',function(){
    console.log("Redis Started")
});

redisClient.on('error',function(error) {
    console.log("Error in Redis" , error);
});

module.exports  = {
    storeServers_Hash : (key , details) => {

        // var test = []
        // test.push({name :'jjes' , fullname : 'fwere'})
        // test.push({})
        redisClient.hmset("servers" , {key : key, details : details})
    }
}

