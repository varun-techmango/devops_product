var redis = require('redis');
var redisClient = redis.createClient();
redisClient.on('connect',function(){
    console.log("Redis Started")
});
        
module.exports  = {
    startRedis : () => {
        console.log("came to redis")
   
        redisClient.on('error',function() {
            console.log("Error in Redis");
        });
    },

    storeDataAsString : (keyvalue , data) => {

        console.log('Store Started - Redis')
        redisClient.set(keyvalue , data)

        // var test = []
        // test.push({name :'jjes' , fullname : 'fwere'})
        // test.push({})
        redisClient.hmset("arraydata" , {name :'jjes' , fullname : 'fwere'})
    }
}



