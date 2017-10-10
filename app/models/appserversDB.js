const  {Client}  = require('pg')
const db = require('../config/pgdb')
var logger = require('../config/herokuLogger')
var respuesta = require('../models/respuesta')
var refCheck = require('../models/refCheck')


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
appserverDB.prototype.createServer = function( response, name, token ){
  if(!name)
    response.status(400).send('Incumplimiento de precondiciones (parámetros faltantes)');
  else{
    client = new Client({connectionString: db.url, ssl:true});
    client.connect((err) => {
      if(err){
        logger.error('Error critico. No se pudo conectar a la base de datos. Error: ' + err)
      }
      else{
        logger.info('Se conecto a la base de datos correctamente.')
      }
    }); // Se conecta el cliente
    var fecha = new Date();
    client.query('INSERT INTO appservers (name, createdBy, createdTime, lastConnection, token) VALUES ($1, $2, $3, $4, $5)', [name, 'me', fecha, fecha, token],(err, res) => {
      console.log(err, res)
    })
    response.status(201).send('Alta correcta');
  }
};


/** @name getAllServers
* @function getAllServers
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param response Objeto para responder al cliente que solicito la informacion
* @param results Lista para guardar a los users
* @return {List} results Lista de appservers en la base de datos
*/
appserverDB.prototype.getAllServers = function(response, results){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
  client.connect((err) => {
    if(err){
      logger.error('Error critico. No se pudo conectar a la base de datos. Error: ' + err);
      response.status(500).send('Unexpected error');
    }
    else{
      logger.info('Se conecto a la base de datos correctamente.')
    }
  });

  var query = client.query('SELECT * FROM appservers', (err, res) =>{
    res.rows.forEach(row =>{
      results.push(row);
    });
    client.end();
    response.status(200).json(respuesta.addResult(respuestaJson, results));
    return(results);
  })
};


/** @name deleteServer
* @function deleteServer
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param userId Numero de usuario a borrar
* @param tokenToCheck Clave enviada que debera matchear con el userId para ejecutar la baja
*/
appserverDB.prototype.deleteServer = function( response, userId, tokenToCheck ){
  client = new Client({connectionString: db.url, ssl:true});
  client.connect((err) => {
    if(err){
      logger.error('Error critico. No se pudo conectar a la base de datos. Error: ' + err)
    }
    else{
      logger.info('Se conecto a la base de datos correctamente.')
    }
  });
  var query = client.query('DELETE FROM appservers WHERE id =  $1 AND token =  $2',[userId, tokenToCheck], ( err, res) =>{
    //checkear errores
        if(err){
          console.log(err);
          client.end();
        }else{
          response.status(200).send('Fin de la operacion');
          client.end();
        }
  });
};


/** @name getServerInfo
* @function createServer
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param userId Id del appserver del cual se quiere obtener la informacion
*/
appserverDB.getServerInfo = function( response, userId ){
  client = new Client({connectionString: db.url, ssl:true});
  var respuestaJson = {};
  if( db.connectClient( client, response ) ){
      logger.info("Se conecto a la base de datos correctamente");
      var results = [];
      client.query('SELECT * FROM appservers WHERE id = $1', [userId], (err, res) =>{
        if( err )
          logger.error('Error en la query');
        else {
            res.rows.forEach(row =>{
            results.push(row);
            });
            if( results.length <= 0 ){
              logger.info('Server inexistente');
              response.status(404).json(respuesta.addError(respuestaJson, 404, 'Server inexistente'));
            } else {
              logger.info('Informacion del server');
              respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion del server');
              response.status(200).json(respuesta.addResult(respuestaJson, results[0]));
            }
          }
      });
    }else{
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    }
}


/** @name updateServerInfo
* @function updateServerInfo
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param userId Id del appserver del cual se quiere modificar la informacion
*/
appserverDB.updateServerInfo = function( response, request, userId ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
    if( db.connectClient( client, response ) ){
      client.query('SELECT _ref FROM appservers WHERE id = $1',[userId], (err, res) =>{
        if(err){
          logger.info('ERROR: ' + err);
          return false;
        }
        else{
          res.rows.forEach(row =>{
            ref = JSON.parse(JSON.stringify(row, null, 2));
          if( ref._ref === request.body._ref ){
            var jsonSV = {"name":request.body.name };
            var newRef = refCheck.generate(jsonSV);
            client.query('UPDATE appservers SET name = $1, _ref = $2 WHERE id = $3',
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
    }else{
      logger.info('Unexpected error');
      response.status(500).send(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    }
}


/** @name renewToken
* @function renewToken
* @memberof appserverDB
* @author Gustavo Adrian Gimenez
* @param newToken token nuevo par ael appserver
* @param oldRef codigo de hash viejo del server
* @param userId id del server al cual se le va a modificar el Token
*/
appserverDB.renewToken = function( response, newToken, oldRef, userId ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
    if( db.connectClient( client, response ) ){
      client.query('SELECT * FROM appservers WHERE id = $1',[userId], (err, res) =>{
        if(err){
          logger.info('ERROR: ' + err);
          return false;
        }
        else{
          res.rows.forEach(row =>{
            appserver = JSON.parse(JSON.stringify(row, null, 2));
          if( appserver._ref === oldRef ){
            var newRef = refCheck.generate(appserver);
            client.query('UPDATE appservers SET token = $1, _ref = $2 WHERE id = $3',
                [ newToken, newRef, userId ], (err, res) =>{
              if( err ){
                logger.info('No existe el recurso solicitado');
                response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
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
        }});
      }
    });
    }else{
      logger.info('Unexpected error');
      response.status(500).send(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    }
}

module.exports = appserverDB;
