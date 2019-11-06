var redis = require('redis');
var redisClient = redis.createClient();
redisClient.on('connect',function(){
    console.log("Redis Started")
});

redisClient.on('error',function(error) {
    console.log("Error in Redis" , error);
});

module.exports  = {
    storeServers_Hash : (category,key , details) => {
        // var test = []
        // test.push({name :'jjes' , fullname : 'fwere'})
        // test.push({})
       // redisClient.hmset("servers" , {key : key, details : details})
       return new Promise((resolve, reject) => {
            redisClient.hmset(category, {[key] : JSON.stringify(details)}, (err, reply) => {
            if(err) {
                reject(err);
            } else {
                resolve(reply);
            }
            });
        });
    },
    getServers_Hash : (category,key) => {
        return new Promise((resolve, reject) => {
            redisClient.hmget(category, key, (err, object) => {
              if(err) {
                reject(err);
              } else {
                resolve(JSON.parse(object));
              }
            });
        });
       // redisClient.hmget("servers" , {key : key, details : details})
    }
}

