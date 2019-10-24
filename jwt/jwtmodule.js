const fs   = require('fs');
const jwt   = require('jsonwebtoken');
var path = require('path');

// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY  = fs.readFileSync(path.resolve('./jwt/private.key'), 'utf8');
var publicKEY  = fs.readFileSync(path.resolve('./jwt/public.key'), 'utf8');  

var options = {
    issuer: "TTS",
    subject: "techmango", 
    audience: "Client_Identity" // this should be provided by client
}
var i  = 'TTS Corp';          // Issuer 
var s  = 'user@techmango.net';        // Subject 
var a  = 'https://www.techmango.net'; // Audience

module.exports = {
 sign: (payload) => {
 
  // Token signing options
  var signOptions = {
      issuer:  i,
      subject:  s,
      audience:  a,
      expiresIn:  "1h",    // 1 h validity
      algorithm:  "RS256"    
  };
  return jwt.sign(payload, privateKEY, signOptions);
},
verify: (token , callBackFn) => {
  /*
   vOption = {
    issuer: "Authorization/Resource/This server",
    subject: "iam@user.me", 
    audience: "Client_Identity" // this should be provided by client
   }  
  */
  var verifyOptions = {
      issuer:  i,
      subject:  s,
      audience:  a,
      expiresIn:  "1h", // 1 h validity
      algorithm:  ["RS256"]
  };
   try{
     return jwt.verify(token, publicKEY, verifyOptions , callBackFn);
   }catch (err){
     return false;
   }
},
 decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
 }
}