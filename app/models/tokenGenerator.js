var key = "taller2 Fiuba Grupo7";
var encryptor = require('simple-encryptor')({key: key});
var jwt = require('jwt-simple');
var secret = 'taller'

function tokenGenerator(){};

tokenGenerator.generateSV = function( Id, serverName, Token ){

  jsonToHash = {
    id: Id,
    name: serverName,
    token: Token
  }

  return (encryptor.encrypt(jsonToHash));

}

tokenGenerator.generateBU = function( Role ){

  var payload = {
    role: Role
  }

  return (jwt.encode(payload, secret));
}

tokenGenerator.process = function( token ){

  try{
    jsonDecrypted =  encryptor.decrypt(token);
  }catch (err){
    jsonDecrypted = null;
  }
  return jsonDecrypted;

}

tokenGenerator.checkBU = function( token, roles, callback ){
  try{
    var decoded = jwt.decode( token, secret );
    if( roles.indexOf(decoded.role) > -1 ){
      console.log(decoded.role)
      callback(true);
    }else{
      callback(false);
    }
  }catch(error){
      callback(false);
  }
}

module.exports = tokenGenerator;
