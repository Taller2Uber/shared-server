const  {Client}  = require('pg')
const db = require('../config/pgdb')
var logger = require('../config/herokuLogger')
var respuesta = require('../models/respuesta')
var refCheck = require('../models/refCheck')


/**
 * @class Clase para definir las llamadas a la base de datos de appservers
 */
function appserverDB(){}


/** @name createUser
* @function createUser
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


/** @name getAllUsers
* @function getAllUsers
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
    respuestaJson = respuesta.addResult(respuestaJson, results);
    response.status(200).json(results);
  })
};


/** @name deleteUser
* @function deleteUser
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
              respuestaJson = respuesta.addError(respuestaJson, 404, 'Server inexistente');
              response.status(404).json(respuestaJson);
            } else {
              logger.info('Informacion del server');
              respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion del server');
              respuestaJson = respuesta.addResult(respuestaJson, results[0]);
              response.status(200).json(respuestaJson);
            }
          }
      });
    }else{
      respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
      response.status(500).json(respuestaJson);
    }
}

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
                respuestaJson = respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado');
                response.status(404).json(respuestaJson);
              } else {
                logger.info('Actualización de información del server conectado');
                respuestaJson = respuesta.addDescription(respuestaJson, 'Modificacion correcta');
                jsonSV._ref = newRef;
                respuestaJson = respuesta.addResult(respuestaJson, jsonSV);
                response.status(200).json(respuestaJson);
              }
          })
        }else{
          logger.info('Ref incorrecto');
          respuestaJson = respuesta.addError(respuestaJson, 409, 'Conflicto en el update. Mal valor de ref');
          response.status(409).json(respuestaJson);
        }});
      }
    });
    }else{
      logger.info('Unexpected error');
      respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
      response.status(500).send(respuestaJson);
}}

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
                respuestaJson = respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado');
                response.status(404).json(respuestaJson);
              } else {
                logger.info('Actualización de token del server conectado');
                respuestaJson = respuesta.addDescription(respuestaJson, 'Modificacion de token correcta');
                appserver._ref = newRef;
                appserver.token = newToken;
                respuestaJson = respuesta.addResult(respuestaJson, appserver);
                response.status(200).json(respuestaJson);
              }
          })
        }else{
          logger.info('Ref incorrecto');
          respuestaJson = respuesta.addError(respuestaJson, 409, 'Conflicto en el update. Mal valor de ref');
          response.status(409).json(respuestaJson);
        }});
      }
    });
    }else{
      logger.info('Unexpected error');
      respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
      response.status(500).send(respuestaJson);
}}

module.exports = appserverDB;
