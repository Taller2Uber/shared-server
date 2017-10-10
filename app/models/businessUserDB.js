const {Client}  = require('pg')
const db = require('../config/pgdb')
var logger = require('../config/herokuLogger')
var refCheck = require('./refCheck')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
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
buDB.prototype.createBU = function ( res, username, password, name, surname, role ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
  if( db.connectClient( client, res ) ){
    if( !username || !password || !name || !surname || !role ){
      logger.error('Incumplimiento de precondiciones (parámetros faltantes)');
      res.status(400).json(respuesta.addError(respuestaJson, 400, 'Incumplimiento de precondiciones'));
    }else{
      var jsonBU = {"username":username, "password":password, "name":name, "surname":surname, "role":role };
      var ref =  refCheck.generate( jsonBU );
      client.query('INSERT INTO businessusers (username, password, name, surname, _ref, role) VALUES ($1, $2, $3, $4, $5, $6)', [username, password, name, surname, ref, role],(err, res) => {
        console.log(err, res)
      })
      res.status(201).json(respuesta.addDescription(respuestaJson, 'Alta correcta'));
    }
  }else{
    res.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  }
  //client.end();
}


/**
* @name getAllBU
* @function getAllBU
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param results array para guardar los resultados
*/
buDB.prototype.getAllBU = function( response, results ){

  client = new Client({connectionString: db.url, ssl:true});
  var respuestaJson = {};
  if ( db.connectClient( client, response ) ){
    var query = client.query('SELECT * FROM businessusers', (err, res) =>{
      res.rows.forEach(row =>{
        results.push(row);
      });
      client.end();
      response.status(200).json(respuesta.addResult(respuestaJson, results));
      return(results);
    })
  }else{
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
  }
  //client.end();
}

/**
* @name checkAuth
* @function checkAuth
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param session Objeto que contiene informacion sobre la sesion actual
*/
buDB.prototype.checkAuth = function( response, request , session){
  if ( !request.body.username || !request.body.password ){
    logger.info('Informacion faltante');
    response.status(500).send('Informacion faltante');
    session = request.session;
    session.authenticated = false;
    return;
  }

  client = new Client({connectionString: db.url, ssl:true});
    if( db.connectClient( client, response ) ){
      logger.info('Se conecto a la base de datos correctamente.')
      var results = [];
      client.query('SELECT * FROM businessusers WHERE username = $1 AND password = $2',[request.body.username, request.body.password], (err, res) =>{
        if(err)
          response.send('Error en la query');
        else{
            res.rows.forEach(row =>{
            results.push(row);
            });
          checkLogin(results, response, request, session);
        }
      });
    }
    //client.end();
}


/**
* @name checkLogin
* @function checkLogin
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param session Objeto que contiene informacion sobre la sesion actual
* @param results array que contiene el usuario a checkear en la primera posicion.
*/
function checkLogin(results, response, request, session){
  if( results.length <= 0 ){
    logger.info('Usuario y password incorrectos');
    var respuestaJson = {};
    response.status(500).json(respuesta.addError(respuestaJson, 500, 'Username y password incorrectos'));
    client.end();
  } else {
    logger.info('Inicio de sesion correcta');
    session = request.session;
    session.authenticated = true;
    session.role = results[0]['role'];
    logger.info('Role: ' + session.role );
    session.userId = results[0]['id'];
    response.status(200).send('Inicio de sesion correcta')
    client.end();
  }
  //client.end();
}

/**
* @name getPersonalInfo
* @function getPersonalInfo
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param userID Id del usuario del cual se quiere obtener la informacion
*/
buDB.prototype.getPersonalInfo = function( response, request, userId ){
  client = new Client({connectionString: db.url, ssl:true});
  var respuestaJson = {};
  if( db.connectClient( client, response ) ){
      logger.info("Se conecto a la base de datos correctamente");
      var results = [];
      client.query('SELECT * FROM businessusers WHERE id = $1', [userId], (err, res) =>{
        if( err )
          response.send('Error en la query');
        else {
            res.rows.forEach(row =>{
            results.push(row);
            });
            if( results.length <= 0 ){
              logger.info('User inexistente');
              //respuestaJson = respuesta.addError(respuestaJson, 404, 'User inexistente');
              response.status(404).json(respuesta.addError(respuestaJson, 404, 'User inexistente'));
            } else {
              logger.info('Informacion del usuario');
              respuestaJson = respuesta.addDescription(respuestaJson, 'Informacion del usuario');
              response.status(200).json(respuesta.addResult(respuestaJson, results[0]));
            }
          }
      });
    }else{
      response.status(500).json(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    }
}


/**
* @name updateInfo
* @function updateInfo
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param userId Id del usuario del cual se quiere modificar la informacion
*/
buDB.prototype.updateInfo = function( response, request, userId ){
  var respuestaJson = {};
  client = new Client({connectionString: db.url, ssl:true});
    if( db.connectClient( client, response ) ){
      client.query('SELECT _ref FROM businessusers WHERE id = $1',[userId], (err, res) =>{
        if(err){
          logger.info('ERROR: ' + err);
          return false;
        }
        else{
          res.rows.forEach(row =>{
            ref = JSON.parse(JSON.stringify(row, null, 2));
          if( ref._ref === request.body._ref ){
            var jsonBU = {"username":request.body.username, "password":request.body.password, "name":request.body.name, "surname":request.body.surname, "role":request.body.role };
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
    }else{
      logger.info('Unexpected error');
      response.status(500).send(respuesta.addError(respuestaJson, 500, 'Unexpected error'));
    }
    //client.end();
}


/**
* @name delete
* @function delete
* @memberof buDB
* @author Gustavo Adrian Gimenez
* @param request Objeto que debe contener el id del usuario a dar baja.
*/
buDB.prototype.delete = function( response, request ){
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
