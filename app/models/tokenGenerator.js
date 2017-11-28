var key = "taller2 Fiuba Grupo7";
var encryptor = require('simple-encryptor')({key: key});
var jwt = require('jwt-simple');
var secret = 'taller'

/**
 * @class Clase para manejar la generacion de token para servidores o usuarios de negocio, y el checkeo de su validez.
 */

function tokenGenerator(){};

/**
* @name generateSV
* @function generateSV
* @memberof tokenGenerator
* @author Gustavo Adrian Gimenez
* @param Id id del servidor al cual hay que generarle el token
* @param serverName Nombre del servidor al cual hay que generarle el token
* @param Token token interno
*/

tokenGenerator.generateSV = function( Id, serverName, Token ){

  jsonToHash = {
    id: Id,
    name: serverName,
    token: Token
  }

  return (encryptor.encrypt(jsonToHash));

}

/**
* @name generateBU
* @function generateBU
* @memberof tokenGenerator
* @author Gustavo Adrian Gimenez
* @param id Id del usuario de negocio al cual se le genera el token
* @param Role rol del usuario de negocio.
*/

tokenGenerator.generateBU = function( Role, id ){

  var payload = {
    role: Role,
    id: id
  }

  return (jwt.encode(payload, secret));
}

/**
* @name process
* @function process
* @memberof tokenGenerator
* @author Gustavo Adrian Gimenez
* @param token String utilizado para verificar su validez como token
*/

tokenGenerator.process = function( token ){
  try{
    jsonDecrypted =  encryptor.decrypt(token);
  }catch (err){
    jsonDecrypted = null;
  }
  return jsonDecrypted;

}

/**
* @name checkBU
* @function checkBU
* @memberof tokenGenerator
* @author Gustavo Adrian Gimenez
* @param token String que contiene el token a verificar
* @param Role roles Lista de strings que contiene los roles de usuario de negocio que deben ser validados en esta request
* @param callback Objeto para devolver la respuesta sobre la validez del usuario de negocio
*/

tokenGenerator.checkBU = function( token, roles, callback ){
  try{
    var decoded = jwt.decode( token, secret );
    if( roles.indexOf(decoded.role) > -1 ){
      callback(true, decoded.id);
    }else{
      callback(false);
    }
  }catch(err){
      callback(false);
  }
}

module.exports = tokenGenerator;
