var respuesta = require('../models/respuesta')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var tokenGenerator = require('./tokenGenerator')
var logger = require('../config/herokuLogger')
const connect = require('../config/pgdb')

/**
 * @class Clase para el checkeo del login de un server y de un usuario de negocio.
 */

function loginCheck(){}

/**
* @name buCheck
* @function business user check
* @memberof loginCheck
* @author Gustavo Adrian Gimenez
* @param response Objeto por el cual se realiza la devolucion a la llamada
* @param userId id del usuario del cual queremos obtener los autos
*/

loginCheck.buCheck = function( req, res ){
  if( !req.session.authenticated){
    var respuestaJson = {};
    respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized');
    res.status(401).json(respuestaJson);
    return false;
  }else {
    return true;
  }
};

/**
* @name serverCheck
* @function server check
* @memberof loginCheck
* @author Gustavo Adrian Gimenez
* @param token codigo recibido por parte del appserver para checkear credenciales
* @param callback objeto para devolver el resultado del check
*/

loginCheck.serverCheck = function( token, callback ){
  var serverJson = tokenGenerator.process( token );
  var results = [];
  var respuestaJson = {};
  respuestaJson = respuesta.addToken(respuestaJson, token);
  respuestaJson = respuesta.addEntityMetadata( respuestaJson );
  if( serverJson != null ){
      connect().query('SELECT * FROM appservers WHERE id = $1 AND name = $2', [serverJson.id, serverJson.name], function (err, res){
        res.rows.forEach(row =>{
          results.push(row);
        });

        if ( results.length <= 0 ){
          callback(false, null);
        }else{
          var timestamp = new Date();
          connect().query('UPDATE appservers SET lastconnection = CURRENT_TIMESTAMP WHERE id = $1 RETURNING lastconnection', [ serverJson.id], function (err, res){
            if(err){
              logger.error('Error al actualizar el lastconnection del server : ' + err);
            }
          })
          respuestaJson = respuesta.addResult(respuestaJson, results[0]);
          callback(true, respuestaJson);
        }
      })
  }else{
    callback(false, null);
  }
}

/**
* @name check
* @function check
* @memberof loginCheck
* @author Gustavo Adrian Gimenez
* @param token codigo recibido por parte del appserver para checkear credenciales
* @param roles array de strings conteniendo los roles que deben recibir permiso
* @param callback objeto para devolver el resultado del check
*/

loginCheck.check = function( token, roles, callback ){
  this.serverCheck( token, function( isServer, serverJson ){
    if( isServer == true ){
      callback(true, serverJson);
    }else{ tokenGenerator.checkBU( token, roles, function( isBU ){
      if (isBU == true){
        callback(true, null);
      }else{
        callback(false, null);
      }
    })
    }
  } )
}

module.exports = loginCheck;
