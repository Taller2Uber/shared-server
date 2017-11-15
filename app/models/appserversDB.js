const connect = require('../config/pgdb')
var logger = require('../config/herokuLogger')
var respuesta = require('../models/respuesta')
var refCheck = require('../models/refCheck')
var tokenGenerator = require('./tokenGenerator')
var refHash = require('./refCheck')
require('dotenv').config();

/**
 * @class Clase para definir las llamadas a la base de datos de appservers
 */
function appserverDB(){}


/** @name createServer
* @function createServer
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param name Nombre del nuevo appserver
* @param token Clave unica de acceso para el nuevo appserver
*/
appserverDB.createServer = function( response, name, token ){
  var respuestaJson = {};
  if(!name)
    response.status(400).send('Incumplimiento de precondiciones (parámetros faltantes)');
  else{
      var fecha = new Date();
      connect().query('INSERT INTO appservers (name, createdBy, createdTime, lastConnection) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [name, 'me'],(err, res) => {
        if(err){
            respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
            logger.error('Unexpected error' + err);
            response.status(500).json(respuestaJson);
        }else{
          var hashedToken = tokenGenerator.generateSV( res.rows[0].id, name, token );
          var ref = refHash.generate( res.rows[0].id );
          connect().query('UPDATE appservers SET token = $1, _ref = $2 WHERE id = $3 RETURNING *', [ hashedToken, ref ,res.rows[0].id ], (err, resu) =>{
            if(err){
              respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
              logger.error('Unexpected error' + err);
              response.status(500).json(respuestaJson);
            }else{
              respuestaJson = respuesta.addEntityMetadata(respuestaJson);
              response.status(200).json( respuesta.addResult(respuestaJson,'server', resu.rows[0]));
            }
          })
        }
      })
  }
}


/** @name getAllServers
* @function getAllServers
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param response Objeto para responder al cliente que solicito la informacion
* @param results Lista para guardar a los users
* @return {List} results Lista de appservers en la base de datos
*/
appserverDB.getAllServers = function(response, results){
  var respuestaJson = {};
    connect().query('SELECT * FROM appservers', (err, res) =>{
      res.rows.forEach(row =>{
        results.push(row);
      });
      respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
      response.status(200).json(respuesta.addResult(respuestaJson, 'servers', results));
      return(results);
    })
}



/** @name deleteServer
* @function deleteServer
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param userId Numero de usuario a borrar
* @param tokenToCheck Clave enviada que debera matchear con el userId para ejecutar la baja
*/
appserverDB.deleteServer = function( response, userId ){
  respuestaJson = {};
    connect().query('DELETE FROM appservers WHERE id =  $1 RETURNING *',[userId], ( err, res) =>{
      if(err){
        respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
        response.status(500).json(respuestaJson);
      }else if( res.rows.length <= 0 ){
        respuestaJson = respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado');
        response.status(404).json(respuestaJson);
      }else{
        respuestaJson = respuesta.addDescription(respuestaJson, 'Baja correcta');
        response.status(404).json(respuestaJson);
      }
    })
};


/** @name getServerInfo
* @function createServer
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param userId Id del appserver del cual se quiere obtener la informacion
*/
appserverDB.getServerInfo = function( response, userId ){

  var respuestaJson = {};
    var results = [];
    connect().query('SELECT * FROM appservers WHERE id = $1', [userId], (err, res) =>{
      if( err )
        logger.error('Error en la query: ' + err);
      else {
          res.rows.forEach(row =>{
          results.push(row);
          });
          if( results.length <= 0 ){
            logger.info('Server inexistente');
            response.status(404).json(respuesta.addError(respuestaJson, 404, 'Server inexistente'));
          } else {
            logger.info('Informacion del server');
            respuestaJson = respuesta.addEntityMetadata(respuestaJson);
            respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion del server');
            response.status(200).json(respuesta.addResult(respuestaJson,'server', results[0]));
          }
        }
    });
}


/** @name updateServerInfo
* @function updateServerInfo
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param userId Id del appserver del cual se quiere modificar la informacion
*/
appserverDB.updateServerInfo = function( response, request, userId ){
  var respuestaJson = {};
    connect().query('SELECT _ref FROM appservers WHERE id = $1',[userId], (err, res) =>{
      if(err){
        logger.info('ERROR: ' + err);
        return false;
      }else if(res.rows.length <= 0){
        respuestaJson = respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado');
        response.status(404).json(respuestaJson);
      }
      else{
        res.rows.forEach(row =>{
          ref = JSON.parse(JSON.stringify(row, null, 2));
        if( ref._ref === request.body._ref ){
          var jsonSV = {"name":request.body.name };
          var newRef = refCheck.generate(jsonSV);
          connect().query('UPDATE appservers SET name = $1, _ref = $2 WHERE id = $3',
              [ request.body.name, newRef, userId ], (err, res) =>{
            if( err ){
              logger.info('No existe el recurso solicitado');
              response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
            } else {
              logger.info('Actualización de información del server conectado');
              respuestaJson = respuesta.addDescription(respuestaJson, 'Modificacion correcta');
              jsonSV._ref = newRef;
              response.status(200).json(respuesta.addResult(respuestaJson, jsonSV));
            }
        })
      }else{
        logger.info('Ref incorrecto');
        response.status(409).json(respuesta.addError(respuestaJson, 409, 'Conflicto en el update. Mal valor de ref'));
      }});
    }
  });
}


/** @name renewToken
* @function renewToken
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param newToken token nuevo par ael appserver
* @param oldRef codigo de hash viejo del server
* @param userId id del server al cual se le va a modificar el Token
*/
appserverDB.renewToken = function( response, token, oldRef, userId ){
  var respuestaJson = {};
    connect().query('SELECT * FROM appservers WHERE id = $1',[userId], (err, res) =>{
      if(err){
        logger.info('ERROR: ' + err);
        respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
        response.status(500).json(respuestaJson);
      }
      else{
        if( res.rows.length <= 0 ){
          logger.info('No existe el recurso solicitado');
          response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
        }else{
          appserver = JSON.parse(JSON.stringify(res.rows[0], null, 2));
          if( appserver._ref === oldRef ){
            var newRef = refCheck.generate(appserver);
            var newToken = tokenGenerator.generateSV(appserver.id, appserver.name, token);
            connect().query('UPDATE appservers SET token = $1, _ref = $2 WHERE id = $3',
            [ newToken, newRef, userId ], (err, res) =>{
              if( err ){
                logger.error('Error al realizar Update: ' + err);
                response.status(500).json({'code':500, 'message': 'Unexpected error'});
              } else {
                logger.info('Actualización de token del server conectado');
                respuestaJson = respuesta.addDescription(respuestaJson, 'Modificacion de token correcta');
                appserver._ref = newRef;
                appserver.token = newToken;
                response.status(200).json(respuesta.addResult(respuestaJson, appserver));
              }
            })
          }else{
            logger.info('Ref incorrecto');
            response.status(409).json(respuesta.addError(respuestaJson, 409, 'Conflicto en el update. Mal valor de ref'));
          }
      }};
    })
}

appserverDB.pingRequest = function( response, newToken, serverId ){
  var respuestaJson = {};
    connect().query('UPDATE appservers SET token = $1 WHERE id = $2',[newToken, serverId], (err, res)=>{
      if(err){
        logger.info('No existe el recurso solicitado');
        response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
      }else{
        logger.info('Operacion correcta');
        respuestaJson = respuesta.addDescription(respuestaJson, 'Operacion correcta');
        respuestaJson.token = newToken;
        response.status(200).json(respuestaJson);
      }
    })
}

module.exports = appserverDB;
