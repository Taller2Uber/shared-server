const pg = require('pg')
var Pool = require('pg-pool')
const db = require('../config/pgdb')
var logger = require('../config/herokuLogger')
var randtoken = require('rand-token');
var refCheck = require('./refCheck')
var tokenGenerator = require('./tokenGenerator')
var respuesta = require('./respuesta')


/**
 * @class Clase para definir las llamadas a la base de datos de appservers
 */
function buDB(){}

/**
* @name createUser
* @function createUser
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param name Nombre del nuevo appserver
* @param token Clave unica de acceso para el nuevo appserver
*/
buDB.createBU = function ( response, username, password, name, surname, role, randomToken ){
  var respuestaJson = {};
  if( !username || !password || !name || !surname || !role ){
    logger.error('Incumplimiento de precondiciones (parámetros faltantes)');
    response.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
  }else{
    const pool = new Pool(db.configDB);
    pool.connect().then(client => {
      client.query('INSERT INTO businessusers (username, password, name, surname, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', [username, password, name, surname, role],(err, res) => {
        if(err){
          response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
        }else{
          var jsonBU = {"username":username, "password":password, "name":name, "surname":surname, "role":role };
          jsonBU.id = res.rows[0].id;
          jsonBU._ref = refCheck.generate(jsonBU) //NO USO EL TOKEN PARA EL REF
          jsonBU.token = tokenGenerator.generateBU(res.rows[0].id, role, randomToken);
          client.query('UPDATE businessusers SET _ref = $1, token = $2 WHERE id = $3', [jsonBU._ref, jsonBU.token, jsonBU.id], (err, res) =>{
            if(err){
              logger.error('Unexpected error: '+ err);
              response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
            }else{
              respuestaJson = respuesta.addResult(respuestaJson, jsonBU);
              response.status(201).json(respuesta.addDescription(respuestaJson, 'Alta correcta'));
            }
          })
          }
      })
    }).catch(e =>{
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    })
  }
}


/**
* @name getAllBU
* @function getAllBU
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param results array para guardar los resultados
*/
buDB.getAllBU = function( response, results ){
  const pool = new Pool(db.configDB);
  var respuestaJson = {};
  pool.connect().then(client =>{
    client.query('SELECT * FROM businessusers', (err, res) =>{
      res.rows.forEach(row =>{
        results.push(row);
      });
      respuestaJson = respuesta.addCollectionMetadata(respuestaJson, results);
      response.status(200).json(respuesta.addResult(respuestaJson, 'users', results));
    })
  }).catch(e =>{
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
}


/**
* @name checkAuth
* @function checkAuth
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param session Objeto que contiene informacion sobre la sesion actual
*/
buDB.checkAuth = function( response, request ){
  var respuestaJson = {}
  if ( !request.body.username || !request.body.password ){
    logger.info('Informacion faltante');
    response.status(400).json(respuesta.addError(respuestaJson, 400,'Incumplimiento de precondiciones (parametros faltantes)'));
  }else{
    const pool = new Pool(db.configDB);
    pool.connect().then(client =>{
      client.query('SELECT * FROM businessusers WHERE username = $1 AND password = $2',[request.body.username, request.body.password], (err, res) =>{
        if(err){
          logger.error('Unexpected error: ' + err);
          respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
          response.status(500).json(respuestaJson);
        }else if(res.rows.length <= 0){
          logger.error('Unauthorized');
          respuestaJson = respuesta.addError(respuestaJson, 401, 'Unauthorized');
          response.status(401).json(respuestaJson);
        }else{
          logger.info('Credenciales correctas');
          token = { token: tokenGenerator.generateBU( res.rows[0].role )};
          respuestaJson = respuesta.addResult(respuestaJson, 'token', token);
          response.status(201).json(respuestaJson);
        }
      })
    }).catch(e =>{
      logger.error('Unexpected error: ' + e);
      respuestaJson = respuesta.addError(respuestaJson, 500, 'Unexpected error');
      response.status(500).json(respuestaJson);
    })
  }
}


/**
* @name getPersonalInfo
* @function getPersonalInfo
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param userID Id del usuario del cual se quiere obtener la informacion
*/
buDB.getPersonalInfo = function( response, request, userId ){
  var respuestaJson = {};
  var pool = new Pool(db.configDB);
  pool.connect().then(client =>{
    var results = [];
    client.query('SELECT * FROM businessusers WHERE id = $1', [userId], (err, res) =>{
      if( err ){
        response.status(500).send('Error en la query');
      }else{
          res.rows.forEach(row =>{
          results.push(row);
          });
          if( results.length <= 0 ){
            logger.info('User inexistente');
            response.status(404).json(respuesta.addError(respuestaJson, 404, 'User inexistente'));
          } else {
            logger.info('Informacion del usuario');
            respuestaJson = respuesta.addEntityMetadata(respuestaJson);
            respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion del usuario');
            response.status(200).json(respuesta.addResult(respuestaJson, results[0]));
          }
        }
    })
  }).catch(e =>{
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  })
}


/**
* @name updateInfo
* @function updateInfo
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param userId Id del usuario del cual se quiere modificar la informacion
*/
buDB.updateInfo = function( response, request, userId ){
  var respuestaJson = {};
  const pool = new Pool(db.configDB);
  if( !request.body.name || !request.body.username || !request.body.password || !request.body.surname || !request.body.role ){
    respuestaJson = respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones (parametros faltantes)');
    response.status(400).json(respuestaJson);
  }else{
    pool.connect().then(client =>{
      client.query('SELECT _ref FROM businessusers WHERE id = $1',[userId], (err, res) =>{
        if(err){
          logger.info('ERROR: ' + err);
          response.status(500).json(respuesta.addError(respuestaJson, 'Unexpected error'));
        }
        else{
          res.rows.forEach(row =>{
            ref = JSON.parse(JSON.stringify(row, null, 2));
            if( ref._ref === request.body._ref ){
              var jsonBU = {"id": userId, "username":request.body.username, "password":request.body.password, "name":request.body.name, "surname":request.body.surname, "role":request.body.role };
              var newRef = refCheck.generate(jsonBU);
              client.query('UPDATE businessusers SET name = $1, username = $2, password = $3, surname = $4, role = $5, _ref = $6 WHERE id = $7',
                  [ request.body.name, request.body.username, request.body.password, request.body.surname, request.body.role ,newRef, userId ], (err, res) =>{
                if( err ){
                  logger.info('No existe el recurso solicitado');
                  response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
                } else {
                  logger.info('Actualización de información del usuario de negocio conectado');
                  respuestaJson = respuesta.addDescription(respuestaJson, 'Modificacion correcta');
                  jsonBU._ref = newRef;
                  response.status(200).json(respuesta.addResult(respuestaJson, jsonBU));
                }
            })
          }else{
            logger.info('Ref incorrecto');
            response.status(409).json(respuesta.addError(respuestaJson, 409, 'Conflicto en el update. Mal valor de ref'));
        }});
      }
    });
    }).catch(e =>{
      logger.info('Unexpected error');
      response.status(500).send(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    })
    pool.end();
}}


/**
* @name delete
* @function delete
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param request Objeto que debe contener el id del usuario a dar baja.
*/
buDB.delete = function( response, request ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, response ) ){
    var query = client.query('DELETE FROM businessusers WHERE id =  $1',[request.params.userId], ( err, res) =>{
          if(err){
            logger.info('No existe el recurso solicitado');
            response.status(404).json(respuesta.addError(respuestaJson, 404, 'No existe el recurso solicitado'));
          }else{
            logger.info('Baja correcta');
            response.status(200).json(respuesta.addDescription(respuestaJson, 'Baja correcta'));
          }
    });
  }
  //client.end();
}


module.exports = buDB;
